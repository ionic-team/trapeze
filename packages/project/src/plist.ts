import plist, { PlistValue } from "plist";
import { writeFile } from '@ionic/utils-fs';
import { parsePlist } from "./util/plist";
import { VFS, VFSRef } from "./vfs";

export class PlistFile {
  doc: PlistValue | null = null;

  constructor(private path: string, private vfs: VFS) {
  }

  getDocument() {
    return this.doc;
  }

  async load() {
    this.doc = await parsePlist(this.path);
    console.log('Loaded plist', this.doc);
    this.vfs.open(this.path, this, this.plistCommitFn);
  }

  private plistCommitFn = async (file: VFSRef) => {
    const data = file.getData();
    const xml = plist.build(data, {
      indent: '	', // Tab character
      offset: -1,
      newline: '\n'
    });
    return writeFile(file.getFilename(), xml);
  }
}
