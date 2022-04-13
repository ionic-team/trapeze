import { dirname, join } from 'path';
import tempy from 'tempy';
import { cloneDeep } from 'lodash';
import { pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { runCommand, spawnCommand } from '../util/subprocess';
import { getIndentation, indent } from '../util/text';
import { VFS, VFSRef } from '../vfs';
import detectIndent from '../util/detect-indent';

export type GradleAST = any;
export interface GradleASTNode {
  type: string;
  name: string;
  source: {
    line: number;
    column: number;
    lastLine: number;
    lastColumn: number;
  };
}

export class GradleFile {
  private parsed: GradleAST | null = null;
  private tempFile: string | null = null;

  constructor(public filename: string, private vfs: VFS) {
  }

  /**
   * Replace the given properties at the specified point in the Gradle file or insert
   * if the replacement doesn't exist
   **/
  async replaceProperties(pathObject: any, toReplace: any): Promise<void> {
    await this.parse();

    if (!this.parsed) {
      throw new Error('Call parse() first to load Gradle file');
    }

    const found = this.find(pathObject);
    if (!found.length) {
      // Create a parent selector object since we're going to insert instead
      const parent = this._makeReplacePathObject(pathObject, Object.keys(toReplace)[0]);
      const foundParent = this.find(parent);

      if (foundParent.length) {
        this.insertIntoGradleFile([toReplace], foundParent[0]);
        return;
      } else {
        throw new Error('Unable to find target in Gradle file to replace or insert');
      }
    }

    const target = found[0];

    return this.replaceInGradleFile(toReplace, target);
  }

  // Build a new pathObject that is the path to the parent rather than
  // the path in pathObject
  _makeReplacePathObject(pathObject: any, injectKey: string) {
    let x: any = {};
    let y = x;

    let a = pathObject;
    while (a) {
      const keys = Object.keys(a);

      if (keys[0] === injectKey || !keys.length) {
        return y;
      }

      const o = {};
      x[keys[0]] = o;
      x = o;

      a = a[keys[0]];
    }

    return y;
  }

  /**
   * Replace an entry in the gradle file.
   */
  // This is a beast, sorry. Hey, at least there's tests
  // In the future, this could be moved to the Java `gradle-parse` package provided in this monorepo
  // along with modifying the AST to inject our script but this works fine forn ow
  private async replaceInGradleFile(toInject: any, targetNode: { node: GradleASTNode, depth: number }) {
    // These values are 1-indexed not 0-indexed
    //let { line, column, lastLine, lastColumn } = targetNode.node.source;
    let { line, column, lastLine, lastColumn } = targetNode.node.source;

    const source = await this.getGradleSource() ?? '';
    const sourceLines = source.split(/\r?\n/);

    if (line == -1) {
      // Set to first line (remember, 1-indexed)
      line = 1;
    }
    if (lastLine === -1) {
      // Set to last line (remember, 1-indexed)
      lastLine = sourceLines.length + 1;
    }

    const detectedIndent = detectIndent(source);

    let lines: string[] = [];

    this.createGradleSource([toInject], lines /* out */, detectedIndent.indent, undefined, targetNode.node);

    const resolvedLastLine = lastLine < 0 ? sourceLines.length : lastLine;

    const formatted = lines.join('\n');

    const indentAmount = targetNode.depth;

    const indented = indent(formatted, detectedIndent.indent, indentAmount - 1);

    // Replace the target lines with our new source line
    const newSource = sourceLines.slice(0, Math.max(0, line - 1))
      .join('\n') +
      '\n' + indented + '\n' +
      sourceLines.slice(Math.max(0, resolvedLastLine), sourceLines.length)
        .join('\n')

    this.vfs.get(this.filename)?.setData(newSource);
  }

  /**
   * Insert the given properties at the specified point in the Gradle file.
   **/
  async insertProperties(pathObject: any, toInject: any[]): Promise<void> {
    await this.parse();

    if (!this.parsed) {
      throw new Error('Call parse() first to load Gradle file');
    }

    const found = this.find(pathObject);
    if (!found.length) {
      throw new Error('Unable to find method in Gradle file to inject');
    }

    const target = found[0];

    return this.insertIntoGradleFile(toInject, target);
  }

  /**
   * Inject the given properties at the specified point in the Gradle file.
   **/
  async insertFragment(pathObject: any, toInject: string): Promise<void> {
    await this.parse();

    if (!this.parsed) {
      throw new Error('Call parse() first to load Gradle file');
    }

    const found = this.find(pathObject);
    if (!found.length) {
      throw new Error('Unable to find method in Gradle file to inject');
    }

    const target = found[0];

    return this.insertIntoGradleFile(toInject, target);
  }

  /**
   * Parse the underlying Gradle file and build the AST. Note: this calls out to
   * a Java process which incurs some overhead and requires JAVA_HOME be correctly
   * set. This is because Gradle is actually a DSL for the Groovy language, which is
   * a JVM language. Additionally, the Groovy parser is based on a modified version
   * of the Antlr project that is tightly bound to the JVM. Ultimatley, this means
   * the only safe, accurate way to feasibly build a Gradle AST is to use the Groovy
   * parser API which this uses under the hood.
   */
  async parse() {
    if (!await pathExists(this.filename)) {
      throw new Error(`Unable to locate file at ${this.filename}`);
    }

    const vfsRef = this.vfs.get(this.filename);

    // We keep a temp file updated with the latest source so the parser can operate
    // on the current state of the file so we can handle multiple modifications to it
    // in sequence
    if (!this.tempFile) {
      // If the temp file doesn't exist yet, create it and write the current file source to it
      const gradleContents = await this.getGradleSource();
      this.tempFile = tempy.file({ extension: 'gradle' });
      await writeFile(this.tempFile, gradleContents);
    } else if (vfsRef) {
      // Otherwise if it already exists then write the current vfs data to it
      await writeFile(this.tempFile, vfsRef.getData());
    }

    const parserRoot = this.getGradleParserPath();
    const java = this.getJava();

    if (!java) {
      throw new Error(this.gradleParseError());
    }

    try {
      const json = await spawnCommand(java, ['-cp', 'lib/*:capacitor-gradle-parse.jar:.', 'com.capacitorjs.gradle.Parse', this.tempFile], {
        cwd: parserRoot,
        stdio: 'pipe'
      });

      this.parsed = JSON.parse(json || '{}');

      return this.parsed;
    } catch (e: any) {
      throw new Error(`Unable to load or parse gradle file: ${e}`);
    }
  }

  /**
   * Inject a modification into the gradle file.
   */
  // This is a beast, sorry. Hey, at least there's tests
  // In the future, this could be moved to the Java `gradle-parse` package provided in this monorepo
  // along with modifying the AST to inject our script but this works fine forn ow
  private async insertIntoGradleFile(toInject: any[] | string, targetNode: { node: GradleASTNode, depth: number }) {
    // These values are 1-indexed not 0-indexed
    let { line, column, lastLine, lastColumn } = targetNode.node.source;

    const source = await this.getGradleSource() ?? '';
    const sourceLines = source.split(/\r?\n/);

    if (line == -1) {
      // Set to first line (remember, 1-indexed)
      line = 1;
    }
    if (lastLine === -1) {
      // Set to last line (remember, 1-indexed)
      lastLine = sourceLines.length + 1;
    }

    const detectedIndent = detectIndent(source);

    let lines: string[] = [];

    if (Array.isArray(toInject)) {
      this.createGradleSource(toInject, lines /* out */, detectedIndent.indent, undefined, targetNode.node);
    } else {
      lines = toInject.split(/\r?\n/);
    }

    const resolvedLastLine = lastLine < 0 ? sourceLines.length : lastLine;

    const formatted = lines.join('\n');

    const indentAmount = targetNode.depth;

    let newSource: string | null = null;

    if (line === lastLine) {
      // Block is empty, like dependencies {}

      const indented = indent(formatted, detectedIndent.indent, indentAmount);
      const sourceLine = sourceLines[line - 1];

      // The new line is the slice from the start of the line to one character before the end (remember,
      // the lines and columns are 1-indexed so lastColumn - 2 is one character before the end
      const newLine = sourceLine.slice(0, Math.max(0, lastColumn - 2)) +
        '\n' +
        indented +
        '\n' +
        indent(
          sourceLine.slice(
            Math.max(0, lastColumn - 2)
          ).trim(),
          detectedIndent.indent,
          Math.max(0, indentAmount - 1)
        );

      newSource = sourceLines.slice(0, Math.max(0, resolvedLastLine - 1))
        .join('\n') +
        '\n' + newLine + '\n' +
        sourceLines.slice(Math.max(0, resolvedLastLine), sourceLines.length)
          .join('\n');
    } else {
      const indented = indent(formatted, detectedIndent.indent, indentAmount);
      newSource = sourceLines.slice(0, Math.max(0, resolvedLastLine - 1))
        .join('\n') +
        '\n' +
        indented +
        '\n' +
        sourceLines.slice(Math.max(0, resolvedLastLine - 1), sourceLines.length)
          .join('\n');
    }

    this.vfs.get(this.filename)?.setData(newSource);
  }

  find(pathObject: any | null): { node: GradleASTNode, depth: number }[] {
    if (!this.parsed) {
      throw new Error('Call parse() first to load Gradle file');
    }

    // Null or empty object means the root node
    if (!pathObject || !Object.keys(pathObject).length) {
      const firstChild = this.parsed.children?.[0];
      if (firstChild) {
        return [{ node: firstChild, depth: 0 }];
      }
      return [];
    }

    const found: { node: GradleASTNode, depth: number }[] = [];
    this._find(pathObject, this.parsed, pathObject, found);
    return found;
  }

  private _find(pathObject: any, node: any, pathNode: any, found: any[], depth = 0) {
    if (!pathNode) {
      return;
    }

    const targetKey = Object.keys(pathNode)?.[0];
    if (!targetKey) {
      return;
    }

    for (const c of node.children) {
      if (this.isTargetNode(c) && c.name === targetKey) {
        pathNode = pathNode[targetKey];
        if (!pathNode || Object.keys(pathNode).length == 0) {
          // We've run out of path nodes to match
          found.push({ node: c, depth });
        }
      }
      this._find(pathObject, c, pathNode, found, c.type === 'block' ? depth + 1 : depth);
    }
  }

  private isTargetNode(node: any) {
    return node.type === 'method' || node.type === 'variable';
  }

  verifyJavaHome() {
    if (!process.env.JAVA_HOME) {
      return false;
    }
    return true;
  }

  getJava(): string | null {
    if (process.env.JAVA_HOME) {
      return join(process.env.JAVA_HOME, 'bin', 'java');
    }
    return null;
  }

  getGradleParserPath() {
    return dirname(require.resolve('@capacitor/gradle-parse'));
  }

  async setApplicationId(applicationId: string) {
    const source = await this.getGradleSource();

    if (source) {
      this.vfs.set(this.filename, source.replace(
        /(applicationId\s+)["'][^"']+["']/,
        `$1"${applicationId}"`,
      ));
    }
  }

  async getApplicationId(): Promise<string | null> {
    const source = await this.getGradleSource();

    if (source) {
      const applicationId = source.match(/applicationId\s+["']([^"']+)["']/);

      if (!applicationId) {
        return null;
      }

      return applicationId[1];
    }
    return null;
  }

  async setVersionCode(versionCode: number) {
    const source = await this.getGradleSource();

    if (source) {
      this.vfs.set(this.filename, source.replace(/(versionCode\s+)\w+/, `$1${versionCode}`));
    }
  }

  async getVersionCode(): Promise<number | null> {
    const source = await this.getGradleSource();

    if (source) {
      const versionCode = source.match(/versionCode\s+(\w+)/);
      if (!versionCode) {
        return null;
      }
      return parseInt(versionCode[1]);
    }
    return null;
  }

  async incrementVersionCode() {
    const source = await this.getGradleSource();

    if (source) {
      const versionCode = source.match(/versionCode\s+(\w+)/);
      if (!versionCode) {
        return;
      }
      const num = parseInt(versionCode[1]);
      if (!isNaN(num)) {
        this.vfs.set(this.filename, source.replace(/(versionCode\s+)\w+/, `$1${num + 1}`));
      }
    }
  }

  async setVersionName(versionName: string) {
    const source = await this.getGradleSource();

    if (source) {
      this.vfs.set(this.filename, source.replace(
        /(versionName\s+)["'][^"']+["']/,
        `$1"${versionName}"`,
      ));
    }
  }

  async getVersionName(): Promise<string | null> {
    const source = await this.getGradleSource();

    if (source) {
      const versionName = source.match(/versionName\s+["']([^"']+)["']/) || null;
      if (!versionName) {
        return null;
      }
      return versionName[1];
    }

    return null;
  }

  /*
  Generate a fragment of Gradle/Groovy code given the inject object

  A gradle edit will be of the form:

  [
    {
      maven: [{
        url: 'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1',
        name: 'Duo-SDK-Feed'
      }]
    }
  ]
  */
  private createGradleSource(injectObj: any[], lines: string[], indentation: string, depth = 0, targetNode: GradleASTNode) {
    for (const entry of injectObj) {
      const keys = Object.keys(entry);

      for (const key of keys) {
        const editEntry = entry[key];

        if (Array.isArray(editEntry)) {
          if (typeof editEntry[0] === 'object') {
            lines.push(`${key} {`);
            this.createGradleSource(editEntry, lines, indentation, depth + 1, targetNode);
            lines.push('}');
          } else {
            if (targetNode.type === 'variable') {
              lines.push(`${key} = ${JSON.stringify(editEntry)}`);
            } else {
              lines.push(`${key} ${editEntry}`);
            }
          }
        } else if (typeof editEntry === 'string' || typeof editEntry === 'number' || typeof editEntry === 'boolean') {
          if (targetNode.type === 'variable') {
            lines.push(indent(`${key} = ${editEntry}`, indentation, depth));
          } else {
            lines.push(indent(`${key} ${editEntry}`, indentation, depth));
          }
        } else {
          const fields = Object.keys(editEntry);

          for (const fieldKey of fields) {
            const fieldEntry = editEntry[fieldKey];

            if (typeof fieldEntry === 'string') {
              lines.push(indent(`${fieldKey} ${fieldEntry}`, indentation, depth));
            } else if (Array.isArray(fieldEntry)) {
              lines.push('{');
              this.createGradleSource(fieldEntry, lines, indentation, depth + 1, targetNode);
              lines.push('}');
            }
          }
        }
      }
    }
  }

  private async getGradleSource(): Promise<string | null> {
    const ref = this.vfs.get(this.filename);
    if (ref) {
      return ref.getData();
    }
    const contents = await readFile(this.filename, { encoding: 'utf-8' });
    this.vfs.open(this.filename, contents, this.gradleCommitFn);
    return contents;
  }

  private gradleParseError() {
    return `JAVA_HOME not set or set incorrectly. Please set JAVA_HOME to the root of your Java installation.\n\nGradle parse functionality depends on a local Java install for accurate Gradle file modification.`
  }

  private gradleCommitFn = async (file: VFSRef) => {
    return writeFile(file.getFilename(), file.getData());
  }
}