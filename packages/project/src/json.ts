import { readJson, writeJson } from '@ionic/utils-fs';
import { mergeWith } from 'lodash';

import { VFS, VFSRef } from "./vfs";

export class JsonFile {
  private json: any | null = null;

  constructor(private path: string, private vfs: VFS) {
  }

  getData() {
    return this.json;
  }

  async load() {
    this.json = await readJson(this.path);
    this.vfs.open(this.path, this.json, this.commitFn);
  }

  async set(properties: any): Promise<void> {
    if (!this.json) {
      return;
    }

    const merged = mergeWith(this.json, properties, (objValue, srcValue) => {
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

    Object.assign(this.json, merged);
  }

  private commitFn = async (file: VFSRef) => {
    return writeJson(file.getFilename(), file.getData());
  }
}