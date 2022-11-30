import { pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { mergeWith } from 'lodash';
import { Logger } from './logger';
import { parseProperties, writeProperties } from './util/properties';
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

    Object.keys(values).forEach(k => {
      this.doc = this.doc.map(e => {
        if (e.key === k) {
          return {
            ...e,
            value: values[k]
          }
        }
        return e;
      });
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