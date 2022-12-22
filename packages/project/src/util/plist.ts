import plist, { PlistObject } from 'plist';
import { readFile } from '@ionic/utils-fs';
import { mergeWith, union, isEmpty } from 'lodash';
import { PlistFile } from '../plist';

export async function parsePlist(filename: string): Promise<PlistObject> {
  const contents = await readFile(filename, { encoding: 'utf-8' });

  const parsed = plist.parse(contents);

  // If the plist is empty an empty array will come back
  // which is not what we want
  if (isEmpty(parsed)) {
    return {};
  }

  return parsed as PlistObject;
}

export function parsePlistString(contents: string): PlistObject {
  const parsed = plist.parse(contents);
  // If the plist is empty an empty array will come back
  // which is not what we want
  if (isEmpty(parsed)) {
    return {};
  }

  return parsed as PlistObject;
}
