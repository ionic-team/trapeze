import { readFile } from '@ionic/utils-fs';

export class VFSRef {
  buffer: Buffer | null;

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

  setData(data: any) {
    this.data = data;
  }
}

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