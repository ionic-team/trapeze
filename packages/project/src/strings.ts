import { pathExists, readFile } from '@ionic/utils-fs';
import { mergeWith } from 'lodash';
import { Logger } from './logger';
import { parseProperties, writeProperties } from './util/properties';
import { parseStrings, StringsEntries } from './util/strings';
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

  async set(values: any): Promise<void> {
    if (!this.doc) {
      return;
    }

    Logger.v('strings', 'update', `${this.path} - ${values}`);

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
      throw new Error(`Unable to locate file at ${this.path}`);
    }
    this.doc = await this.parse(this.path);
    Logger.v('strings', 'load', `at ${this.path}`, this.doc);
    this.vfs.open(this.path, this.doc, this.commitFn);
  }

  private async parse(path: string): Promise<StringsEntries> {
    const contents = await readFile(path, { encoding: 'utf-8' });
    return parseStrings(contents);
  }

  private commitFn = async (file: VFSFile) => {
    return writeProperties(file.getFilename(), file.getData());
  }
}