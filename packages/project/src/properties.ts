import { pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { Logger } from './logger';
import { assertParentDirs, readFileOrEmpty } from './util/fs';
import { generateProperties, parseProperties, PropertiesLine, setProperty, toPropertiesObject } from './util/properties';
import { VFS, VFSFile, VFSStorable } from './vfs';

/**
 * Java .properties files
 */
export class PropertiesFile extends VFSStorable {
  private lines: PropertiesLine[] | null = null;
  constructor(public path: string, private vfs: VFS) {
    super();
  }

  getProperties(): Record<string, string> {
    return toPropertiesObject(this.lines ?? []);
  }

  async updateProperties(properties: Record<string, unknown>): Promise<void> {
    if (!this.lines) {
      return;
    }

    Logger.v('properties', 'update', `${this.path} - ${properties}`);

    for (const [key, value] of Object.entries(properties)) {
      this.lines = setProperty(this.lines, { key, value: String(value) });
    }
    this.vfs.markModified(this.path);
  }

  async load() {
    if (this.vfs.isOpen(this.path)) {
      return;
    }

    if (!await pathExists(this.path)) {
      throw new Error(`Unable to locate file at ${this.path}`);
    }
    this.lines = parseProperties(await readFile(this.path, { encoding: 'utf-8' }));
    Logger.v('properties', 'load', `at ${this.path}`, this.getProperties());
    this.vfs.open(this.path, this, this.commitFn, this.diffFn);
  }

  generate() {
    return generateProperties(this.lines ?? []);
  }

  private commitFn = async (file: VFSFile) => {
    await assertParentDirs(file.getFilename());
    return writeFile(file.getFilename(), (file.getData() as PropertiesFile).generate());
  }

  private diffFn = async (file: VFSFile) => {
    return {
      old: await readFileOrEmpty(file.getFilename()),
      new: (file.getData() as PropertiesFile).generate(),
    };
  }
}
