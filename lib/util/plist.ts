import plist from 'plist';
import { readFile } from '@ionic/utils-fs';

export async function parsePlist(filename) {
  const contents = await readFile(filename, { encoding: 'utf-8' });

  return plist.parse(contents);
}