// All classes that are stored in the VFS must implement this interface
export interface VFSStorable {
}

/**
 * Reference to a file and its data (which can be of any type) in the VFS
 */
export class VFSRef<T extends string | VFSStorable> {
  buffer: Buffer | null = null;

  modified = false;

  constructor(private filename: string, private data: T | null, private commitFn: (file: VFSRef<T>) => Promise<void>) { }

  getFilename() {
    return this.filename;
  }

  getData(): T | null {
    return this.data;
  }

  isModified() {
    return this.modified;
  }

  setData(data: T) {
    this.data = data;
    this.modified = true;
  }

  commit() {
    return this.commitFn(this);
  }
}

export type VFSRefFile = VFSRef<string | VFSStorable>;

/**
 * Simple virtual filesystem to share files across operations and
 * keep track of modifications over time
 */
export class VFS {
  private openFiles: { [path: string]: VFSRef<any> } = {};

  constructor() { }

  open(filename: string, data: string | VFSStorable, commitFn: (file: VFSRefFile) => Promise<void>) {
    const ref = new VFSRef(filename, data, commitFn);
    this.openFiles[filename] = ref;
    return ref;
  }

  get(filename: string): VFSRef<any> | null {
    return this.openFiles[filename] ?? null;
  }

  all() {
    return Object.keys(this.openFiles).reduce((files, fname) => {
      files[fname] = this.openFiles[fname];
      return files;
    }, {} as { [key: string]: VFSRefFile });
  }

  async commitAll() {
    await Promise.all(Object.values(this.openFiles).map(file => file.commit()));
  }

  set(filename: string, data: string | VFSStorable) {
    this.get(filename)?.setData(data);
  }

  close(ref: VFSRefFile) {
    delete this.openFiles[ref.getFilename()];
  }
}