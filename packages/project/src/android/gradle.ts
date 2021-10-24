import { dirname, join } from 'path';
import { pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { runCommand } from '../util/subprocess';
import { getIndentation, indent } from '../util/text';
import { VFS, VFSRef } from '../vfs';
import detectIndent from '../util/detect-indent';
import tempy from 'tempy';

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

export class Gradle {
  private parsed: GradleAST | null = null;
  private tempFile: string | null = null;

  constructor(public filename: string, private vfs: VFS) {
  }

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
      const gradleContents = await readFile(this.filename, { encoding: 'utf-8' });
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
      const json = await runCommand(java, ['-cp', 'lib/*:capacitor-gradle-parse.jar:.', 'com.capacitorjs.gradle.Parse', this.tempFile], {
        cwd: parserRoot
      });

      this.parsed = JSON.parse(json || '{}');

      return this.parsed;
    } catch (e: any) {
      throw new Error(`Unable to load or parse gradle file: ${e}`);
    }
  }

  /**
   * Insert the given properties at the specified point in the Gradle file.
   **/
  async insertProperties(pathObject: any, toInject: any[]): Promise<void> {
    await this.parse();

    if (!this.parsed) {
      throw new Error('Call parse() first to load Gradle file');
    }

    const nodes = this.find(pathObject);
    if (!nodes.length) {
      throw new Error('Unable to find method in Gradle file to inject');
    }

    const target = this.find(pathObject)?.[0];

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

    const nodes = this.find(pathObject);
    if (!nodes.length) {
      throw new Error('Unable to find method in Gradle file to inject');
    }

    const target = this.find(pathObject)?.[0];

    return this.insertIntoGradleFile(toInject, target);
  }

  /**
   * Inject a modification into the gradle file
   */

  // This is a beast, sorry. Hey, at least there's tests
  private async insertIntoGradleFile(toInject: any[] | string, targetNode: GradleASTNode) {
    // These values are 1-indexed not 0-indexed
    let { line, column, lastLine, lastColumn } = targetNode.source;

    const source = await this.getGradleSource();
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
      this.createGradleSource(toInject, lines /* out */, detectedIndent.indent);
    } else {
      lines = toInject.split(/\r?\n/);
    }

    const resolvedLine = line < 0 ? 0 : line;
    const resolvedLastLine = lastLine < 0 ? sourceLines.length : lastLine;

    const indentation = getIndentation(sourceLines[resolvedLine - 1]);
    const indentAmount = typeof indentation !== 'undefined' ? Math.floor((indentation ?? '').length / detectedIndent.amount) : -1;
    const formatted = '\n' + lines.join('\n') + '\n';

    let newSource: string | null = null;

    if (line === lastLine) {
      // Block is empty, like dependencies {}

      const indented = indent(formatted, detectedIndent.indent, indentAmount + 1);
      const sourceLine = sourceLines[line - 1];

      // The new line is the slice from the start of the line to one character before the end (remember,
      // the lines and columns are 1-indexed so lastColumn - 2 is one character before the end
      const newLine = sourceLine.slice(0, Math.max(0, lastColumn - 2)) +
        indented +
        indent(
          sourceLine.slice(
            Math.max(0, lastColumn - 2)
          ).trim(),
          detectedIndent.indent,
          Math.max(0, indentAmount)
        );

      newSource = sourceLines.slice(0, Math.max(0, resolvedLastLine - 1))
        .join('\n') +
        '\n' + newLine + '\n' +
        sourceLines.slice(Math.max(0, resolvedLastLine), sourceLines.length)
          .join('\n');
    } else {
      const indented = indent(formatted, detectedIndent.indent, indentAmount + 1);
      newSource = sourceLines.slice(0, Math.max(0, resolvedLastLine - 1))
        .join('\n') +
        indented +
        sourceLines.slice(Math.max(0, resolvedLastLine - 1), sourceLines.length)
          .join('\n');
    }

    console.log(newSource);

    this.vfs.get(this.filename).setData(newSource);
  }

  find(pathObject: any | null): GradleASTNode[] {
    if (!this.parsed) {
      throw new Error('Call parse() first to load Gradle file');
    }

    // Null or empty object means the root node
    if (!pathObject || !Object.keys(pathObject).length) {
      const firstChild = this.parsed.children?.[0];
      if (firstChild) {
        return [firstChild];
      }
      return [];
    }

    const found: any[] = [];
    this._find(pathObject, this.parsed, pathObject, found);
    return found;
  }

  private _find(pathObject: any, node: any, pathNode: any, found: any[]) {
    const targetKey = Object.keys(pathNode)?.[0];
    if (!targetKey) {
      return;
    }

    for (const c of node.children) {
      if (c.type === 'method' && c.name === targetKey) {
        pathNode = pathNode[targetKey];
        if (!pathNode || Object.keys(pathNode).length == 0) {
          // We've run out of path nodes to match
          found.push(c);
        }
      }
      this._find(pathObject, c, pathNode, found);
    }
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
  private createGradleSource(injectObj: any[], lines: string[], indentation: string, depth = 0) {
    for (const entry of injectObj) {

      const keys = Object.keys(entry);

      for (const key of keys) {
        const editEntry = entry[key];

        if (Array.isArray(editEntry)) {
          lines.push(`${key} {`);
          this.createGradleSource(editEntry, lines, indentation, depth + 1);
          lines.push('}');
        } else if (typeof editEntry === 'string') {
          lines.push(indent(`${key} ${editEntry}`, indentation, depth));
        } else {
          const fields = Object.keys(editEntry);

          for (const fieldKey of fields) {
            const fieldEntry = editEntry[fieldKey];

            if (typeof fieldEntry === 'string') {
              lines.push(indent(`${fieldKey} ${fieldEntry}`, indentation, depth));
            } else if (Array.isArray(fieldEntry)) {
              lines.push('{');
              this.createGradleSource(fieldEntry, lines, indentation, depth + 1);
              lines.push('}');
            }
          }
        }
      }
    }
  }


  private async getGradleSource() {
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