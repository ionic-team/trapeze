import { mkdirp, readFile } from '@ionic/utils-fs';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';

export async function assertParentDirs(path: string) {
  const dirs = dirname(path);
  await mkdirp(dirs);
}

/**
 * Read a file, treating a file that doesn't exist yet as empty. Diffing a file an
 * operation is about to create has no previous contents to compare against.
 */
export async function readFileOrEmpty(path: string): Promise<string> {
  try {
    return await readFile(path, { encoding: 'utf-8' });
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      return '';
    }
    throw e;
  }
}

/**
 * List every file below the given directory, sub directories included.
 */
export async function listFilesRecursive(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(entry => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? listFilesRecursive(path) : [path];
    }),
  );

  return files.flat();
}
