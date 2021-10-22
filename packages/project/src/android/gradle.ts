import { dirname, join } from 'path';
import { readFile } from '@ionic/utils-fs';
import { runCommand } from '../util/subprocess';
import { getIndentation, indent } from '../util/text';
import { VFS, VFSRef } from '../vfs';

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

  constructor(private filename: string, private vfs: VFS) {
  }

  async parse() {
    const parserRoot = this.getGradleParserPath();
    const java = this.getJava();

    if (!java) {
      throw new Error(this.gradleParseError());
    }

    const json = await runCommand(java, ['-cp', 'lib/*:capacitor-gradle-parse.jar:.', 'com.capacitorjs.gradle.Parse', this.filename], {
      cwd: parserRoot
    });

    this.parsed = JSON.parse(json || '{}');

    return this.parsed;
  }

  /**
   * Inject the given properties at the specified point in the Gradle file.
   **/
  injectProperties(pathObject: any, toInject: any[]): Promise<void> {
    if (!this.parsed) {
      throw new Error('Call parse() first to load Gradle file');
    }

    const nodes = this.find(pathObject);
    if (!nodes.length) {
      throw new Error('Unable to find method in Gradle file to inject');
    }

    const target = this.find(pathObject)?.[0];

    const lines: string[] = [];
    this.createGradleSource(toInject, lines);

    console.log('Injecting lines', lines);
    return this.injectIntoGradleFile(lines, target);
  }

  /*
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
  createGradleSource(injectObj: any[], lines: string[], depth = 0) {
    /*
    const lines = injectObj.map((o: any) => {
      const key = Object.keys(o)[0];
      if (!key) {
        return null;
      }

      return `${key} ${o[key]}`;
    }).filter((o: any) => !!o) as string[];

    return lines;
    */
    console.log(injectObj);

    for (const entry of injectObj) {

      const keys = Object.keys(entry);

      for (const key of keys) {
        const editEntry = entry[key];

        if (Array.isArray(editEntry)) {
          lines.push(`${key} {`);
          this.createGradleSource(editEntry, lines, depth + 1);
          lines.push('}');
        } else if (typeof editEntry === 'string') {
          lines.push(indent(`${key} ${editEntry}`, ' ', depth));
        } else {
          const fields = Object.keys(editEntry);

          for (const fieldKey of fields) {
            const fieldEntry = editEntry[fieldKey];

            if (typeof fieldEntry === 'string') {
              lines.push(indent(`${fieldKey} ${fieldEntry}`, ' ', depth));
            } else if (Array.isArray(fieldEntry)) {
              lines.push('{');
              this.createGradleSource(fieldEntry, lines, depth + 1);
              lines.push('}');
            }
          }
        }
      }
    }
  }


  async injectIntoGradleFile(lines: string[], targetNode: GradleASTNode) {
    const { line, column, lastLine, lastColumn } = targetNode.source;
    console.log('Injecting', line, column, lastLine, lastColumn);

    const source = await readFile(this.filename, { encoding: 'utf-8' });
    const vfsRef = this.vfs.open(this.filename, source, this.gradleCommitFn);
    const sourceLines = source.split(/\r?\n/);

    const resolvedLine = line < 0 ? 0 : line;
    const resolvedLastLine = lastLine < 0 ? sourceLines.length : lastLine;

    const indentation = getIndentation(sourceLines[resolvedLine]);
    const formatted = '\n' + lines.join('\n') + '\n';
    const indented = indent(formatted, ' ', indentation?.length || 0);
    const newSource = sourceLines.slice(0, Math.max(0, resolvedLastLine - 1)).join('\n') + indented + sourceLines.slice(Math.max(0, resolvedLastLine - 1), sourceLines.length).join('\n');

    console.log(newSource);

    vfsRef.setData(newSource);
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

  private gradleParseError() {
    return `JAVA_HOME not set or set incorrectly. Please set JAVA_HOME to the root of your Java installation.\n\nGradle parse functionality depends on a local Java install for accurate Gradle file modification.`
  }

  private gradleCommitFn = async (_file: VFSRef) => {
  }
}