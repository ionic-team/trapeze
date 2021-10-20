import { readFile } from '@ionic/utils-fs';

/**
 * Reference to a file and its data (which can be of any type) in the VFS
 */
export class VFSRef {
  buffer: Buffer | null;

  modified = false;

  constructor(private filename, private data, private commitFn: (file: VFSRef) => Promise<void>) { }

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

  commit() {
    return this.commitFn(this);
  }
}

/**
 * Simple virtual filesystem to share files across operations and
 * keep track of modifications over time
 */
export class VFS {
  private openFiles: { [path: string]: VFSRef } = {};

  constructor() { }

  open(filename: string, data: any, commitFn: (file: VFSRef) => Promise<void>) {
    const ref = new VFSRef(filename, data, commitFn);
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

  commitAll() {
    return Promise.all(Object.values(this.openFiles).map(file => file.commit()));
  }

  set(filename: string, data: any) {
    this.get(filename)?.setData(data);
  }

  close(ref: VFSRef) {
    delete this.openFiles[ref.getFilename()];
  }
}