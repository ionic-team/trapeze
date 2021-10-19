import { readFile } from '@ionic/utils-fs';

/**
 * Reference to a file and its data (which can be of any type) in the VFS
 */
export class VFSRef {
  buffer: Buffer | null;

  modified = false;

  constructor(private filename, private data) { }

  async read() {
    this.buffer = await readFile(this.filename);
  }

  getFilename() {
    return this.filename;
  }

  getData(): any {
    return this.data;
  }

  isModified() {
    return this.modified;
  }

  setData(data: any) {
    this.data = data;
    this.modified = true;
  }
}

/**
 * Simple virtual filesystem to share files across operations and
 * keep track of modifications over time
 */
export class VFS {
  private openFiles: { [path: string]: VFSRef } = {};

  constructor() { }

  open(filename: string, data: any) {
    const ref = new VFSRef(filename, data);
    this.openFiles[filename] = ref;
    return ref;
  }

  get(filename: string) {
    return this.openFiles[filename];
  }

  all() {
    return Object.keys(this.openFiles).reduce((files, fname) => {
      files[fname] = this.openFiles[fname];
      return files;
    }, {});
  }

  set(filename: string, data: any) {
    this.get(filename)?.setData(data);
  }

  close(ref: VFSRef) {
    delete this.openFiles[ref.getFilename()];
  }
}