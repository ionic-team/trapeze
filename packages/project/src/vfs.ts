/**
 * Reference to a file and its data (which can be of any type) in the VFS
 */
export class VFSRef {
  buffer: Buffer | null = null;

  modified = false;

  constructor(private filename: string, private data: any, private commitFn: (file: VFSRef) => Promise<void>) { }

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

  get(filename: string): VFSRef | null {
    return this.openFiles[filename] ?? null;
  }

  all() {
    return Object.keys(this.openFiles).reduce((files, fname) => {
      files[fname] = this.openFiles[fname];
      return files;
    }, {} as { [key: string]: VFSRef });
  }

  async commitAll() {
    await Promise.all(Object.values(this.openFiles).map(file => file.commit()));
  }

  set(filename: string, data: any) {
    this.get(filename)?.setData(data);
  }

  close(ref: VFSRef) {
    delete this.openFiles[ref.getFilename()];
  }
}