import { readFile, writeFile } from '@ionic/utils-fs';
import ini from 'ini';

export async function parseProperties(filename: string) {
  const data = await readFile(filename, { encoding: 'utf-8' })
  return ini.parse(data);
}

export function serializeProperties(data: any) {
  return ini.stringify(data);
}

export async function writeProperties(filename: string, data: any) {
  return writeFile(filename, serializeProperties(data));
}
