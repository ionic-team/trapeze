import { pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { mergeWith, union } from 'lodash';
import { parseProperties, writeProperties } from './util/properties';
import { VFS, VFSRef, VFSFile, VFSStorable } from './vfs';

export class PropertiesFile extends VFSStorable {
  private doc: any;
  constructor(public path: string, private vfs: VFS) {
    super();
  }

  getProperties() {
    return this.doc;
  }

  async updateProperties(properties: any): Promise<void> {
    if (!this.doc) {
      return;
    }

    const merged = mergeWith(this.doc, properties, (objValue, srcValue) => {
      // Override the default merge behavior for arrays of objects that have the
      // same sub-key. Otherwise lodash merge doesn't work how we need it to
      if (Array.isArray(objValue)) {
        //if (replace) {
          return srcValue;
        //}

        /*
        const firstObjValue = objValue[0];
        const firstSrcValue = srcValue[0];

        // https://github.com/ionic-team/capacitor-configure/issues/32
        // When merging an array of dicts, like when modifying
        // CFBundleURLTypes, we don't want to union the two arrays because that
        // would result in duplicated array of dicts. Instead, we want to merge as-is.
        // This check makes sure we're not trying to union an array of dicts
        if (typeof firstObjValue !== 'object' && typeof firstSrcValue !== 'object') {
          return union(objValue, srcValue);
        }
        */
      } else if (typeof objValue === 'object' && objValue !== null) {
        //if (replace) {
          return srcValue;
        //}
      }
    });
    Object.assign(this.doc, merged);
  }

  async load() {
    if (this.vfs.isOpen(this.path)) {
      return;
    }

    if (!await pathExists(this.path)) {
      throw new Error(`Unable to locate file at ${this.path}`);
    }
    this.doc = await parseProperties(this.path);
    this.vfs.open(this.path, this.doc, this.commitFn);
  }

  private commitFn = async (file: VFSFile) => {
    return writeProperties(file.getFilename(), file.getData());
  }
}