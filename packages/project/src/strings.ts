import { pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { relative } from 'path';
import { Logger } from './logger';
import { MobileProject } from './project';
import { assertParentDirs, readFileOrEmpty } from './util/fs';
import { escapeStringsText, generateStrings, parseStrings, setStringsEntry, StringsEntries } from './util/strings';
import { VFS, VFSFile, VFSStorable } from './vfs';

/**
 * iOS .strings files
 */
export class StringsFile extends VFSStorable {
  private doc: StringsEntries = [];
  constructor(public path: string, private vfs: VFS, private project?: MobileProject) {
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
      // The document holds escaped source text. The values passed in are plain text.
      const key = escapeStringsText(k);
      const value = escapeStringsText(String(values[k]));
      this.doc = setStringsEntry(this.doc, { key, value });
    });

    this.vfs.markModified(this.path);
  }

  async load() {
    if (this.vfs.isOpen(this.path)) {
      return;
    }

    if (!await pathExists(this.path)) {
      this.doc = [];
      // Add the file to the iOS project
      if (this.project) {
        const rel = relative(this.project.config.ios?.path ?? '', this.path);
        this.project?.ios?.addFile(rel);
      }
    } else {
      this.doc = await this.parse(this.path);
    }
    Logger.v('strings', 'load', `at ${this.path}`);
    this.vfs.open(this.path, this, this.commitFn, this.diffFn);
  }

  generate() {
    return generateStrings(this.doc);
  }

  private async parse(path: string): Promise<StringsEntries> {
    const contents = await readFile(path, { encoding: 'utf-8' });
    return parseStrings(contents);
  }

  private commitFn = async (file: VFSFile) => {
    const src = (file.getData() as StringsFile).generate();
    await assertParentDirs(file.getFilename());
    return writeFile(file.getFilename(), src);
  }

  private diffFn = async (file: VFSFile) => {
    return {
      old: await readFileOrEmpty(file.getFilename()),
      new: (file.getData() as StringsFile).generate(),
    };
  }
}