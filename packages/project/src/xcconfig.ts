import { pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { Logger } from './logger';
import { generateXCConfig, parseXCConfig, XCConfigEntries } from './parse/xcconfig';
import { VFS, VFSFile, VFSStorable } from './vfs';

/**
 * iOS .strings files
 */
export class XCConfigFile extends VFSStorable {
  private doc: XCConfigEntries = [];
  constructor(public path: string, private vfs: VFS) {
    super();
  }

  getDocument() {
    return this.doc;
  }

  async set(values: any) {
    if (!this.doc) {
      return;
    }

    Logger.v('strings', 'update', `${this.path}`);

    Object.keys(values).forEach(k => {
      let found = false;
      this.doc = this.doc.map(e => {
        if (e.key === k) {
          found = true;
          return {
            ...e,
            value: values[k]
          }
        }
        return e;
      });

      const lastEntry = this.doc[Math.max(0, this.doc.length - 1)];

      if (!found) {
        if (lastEntry) {
          this.doc.push({
            content: '\n\n',
            startLine: lastEntry ? lastEntry.endLine + 1 : 0,
            startCol: 0,
            endLine: lastEntry ? lastEntry.endLine + 2 : 0,
            endCol: 0
          });
        }
        this.doc.push({
          key: k,
          value: values[k],
          startLine: lastEntry ? lastEntry.endLine + 3 : 0,
          startCol: 0,
          endLine: lastEntry ? lastEntry.endLine + 4 : 0,
          endCol: 0
        });
      }
    });
  }

  async load() {
    if (this.vfs.isOpen(this.path)) {
      return;
    }

    if (!await pathExists(this.path)) {
      this.doc = [];
    } else {
      this.doc = await this.parse(this.path);
    }
    Logger.v('strings', 'load', `at ${this.path}`);
    this.vfs.open(this.path, this, this.commitFn);
  }

  generate() {
    return generateXCConfig(this.doc);
  }

  private async parse(path: string): Promise<XCConfigEntries> {
    const contents = await readFile(path, { encoding: 'utf-8' });
    return parseXCConfig(contents);
  }

  private commitFn = async (file: VFSFile) => {
    const entries = file.getData() as XCConfigEntries;
    const src = generateXCConfig(entries);
    return writeFile(file.getFilename(), src);
  }
}