import { mkdirp } from '@ionic/utils-fs';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';

export async function assertParentDirs(path: string) {
  const dirs = dirname(path);
  await mkdirp(dirs);
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
