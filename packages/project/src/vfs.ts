import * as Diff from 'diff';

export interface VFSDiff {
  file?: VFSFile;
  old?: string;
  new?: string;
  patch?: string;
}

// All classes that are stored in the VFS must implement this interface
export class VFSStorable {}

/**
 * Reference to a file and its data (which can be of any type) in the VFS
 */
export class VFSRef<T extends VFSStorable> {
  buffer: Buffer | null = null;

  modified = false;

  constructor(
    private filename: string,
    private data: T | null,
    private commitFn: (file: VFSFile) => Promise<void>,
    private diffFn?: (file: VFSFile) => Promise<VFSDiff>,
  ) {}

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

  async diff(): Promise<VFSDiff> {
    const diff = (await this.diffFn?.(this)) ?? Promise.resolve({ file: this });

    return {
      ...diff,
      file: this,
    };
  }
}

export type VFSFile = VFSRef<string | VFSStorable>;

/**
 * Simple virtual filesystem to share files across operations and
 * keep track of modifications over time
 */
export class VFS {
  private openFiles: { [path: string]: VFSRef<any> } = {};

  constructor() {}

  open<T extends VFSStorable>(
    filename: string,
    data: T,
    commitFn: (file: VFSFile) => Promise<void>,
    diffFn?: (file: VFSFile) => Promise<VFSDiff>,
  ) {
    const ref = new VFSRef(filename, data, commitFn, diffFn);
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

  async diffAll() {
    const diffs = await Promise.all(
      Object.values(this.openFiles).map(file => {
        if (file.diff) {
          return file.diff();
        }
        return null;
      })
    );
    return diffs.filter(d => !!d).map(diff => ({
      ...diff!,
      patch: Diff.createPatch(diff?.file?.getFilename() ?? '', diff?.old ?? '', diff?.new ?? '') // Diff.diffChars(diff!.old ?? '', diff!.new ?? '')
    })) as VFSDiff[];
  }

  set(filename: string, data: string | VFSStorable) {
    this.get(filename)?.setData(data);
  }

  close(ref: VFSFile) {
    delete this.openFiles[ref.getFilename()];
  }
}
