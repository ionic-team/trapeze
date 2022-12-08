import { mkdirp, pathExists } from '@ionic/utils-fs';
import { dirname } from 'path';

export async function assertParentDirs(path: string) {
  const dirs = dirname(path);
  await mkdirp(dirs);
}