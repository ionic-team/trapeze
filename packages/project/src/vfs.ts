// All classes that are stored in the VFS must implement this interface
export class VFSStorable {
}

/**
 * Reference to a file and its data (which can be of any type) in the VFS
 */
export class VFSRef<T extends VFSStorable> {
  buffer: Buffer | null = null;

  modified = false;

  constructor(private filename: string, private data: T | null, private commitFn: (file: VFSFile) => Promise<void>) { }

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

  commit(): Promise<void> {
    return this.commitFn(this);
  }
}

export type VFSFile = VFSRef<string | VFSStorable>;

/**
 * Simple virtual filesystem to share files across operations and
 * keep track of modifications over time
 */
export class VFS {
  private openFiles: { [path: string]: VFSRef<any> } = {};

  constructor() { }

  open<T extends VFSStorable>(filename: string, data: T, commitFn: (file: VFSFile) => Promise<void>) {
    const ref = new VFSRef(filename, data, commitFn);
    this.openFiles[filename] = ref;
    return ref;
  }

  get<T extends VFSStorable>(filename: string): VFSRef<T> | null {
    return this.openFiles[filename] ?? null;
  }

  all() {
    return Object.keys(this.openFiles).reduce((files, fname) => {
      files[fname] = this.openFiles[fname];
      return files;
    }, {} as { [key: string]: VFSFile });
  }

  async commitAll() {
    await Promise.all(Object.values(this.openFiles).map(file => file.commit()));
  }

  set(filename: string, data: string | VFSStorable) {
    this.get(filename)?.setData(data);
  }

  close(ref: VFSFile) {
    delete this.openFiles[ref.getFilename()];
  }
}