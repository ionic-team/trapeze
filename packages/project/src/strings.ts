import { pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { Logger } from './logger';
import { generateStrings, parseStrings, StringsEntries } from './util/strings';
import { VFS, VFSFile, VFSStorable } from './vfs';

/**
 * iOS .strings files
 */
export class StringsFile extends VFSStorable {
  private doc: StringsEntries = [];
  constructor(public path: string, private vfs: VFS) {
    super();
  }

  getDocument() {
    return this.doc;
  }

  async setFromJson(jsonFile: any): Promise<void> {
    const json = JSON.parse(await readFile(jsonFile, { encoding: 'utf-8' }));

    this.set(json);
  }

  async set(values: any) {
    if (!this.doc) {
      return;
    }

    Logger.v('strings', 'update', `${this.path}`);

    console.log('Setting', values);
    console.log('For', this.doc);

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
        this.doc.push({
          content: '\n\n',
          startLine: lastEntry ? lastEntry.endLine + 1 : 0,
          startCol: 0,
          endLine: lastEntry ? lastEntry.endLine + 2 : 0,
          endCol: 0
        })
        this.doc.push({
          key: k,
          value: values[k],
          startLine: lastEntry ? lastEntry.endLine + 3 : 0,
          startCol: 0,
          endLine: lastEntry ? lastEntry.endLine + 4 : 0,
          endCol: 0
        })
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
    return generateStrings(this.doc);
  }

  private async parse(path: string): Promise<StringsEntries> {
    const contents = await readFile(path, { encoding: 'utf-8' });
    return parseStrings(contents);
  }

  private commitFn = async (file: VFSFile) => {
    const entries = file.getData() as StringsEntries;
    const src = generateStrings(entries);
    return writeFile(file.getFilename(), src);
  }
}