import plist from 'plist';
import { readFile } from '@ionic/utils-fs';
import { mergeWith, union, isEmpty } from 'lodash';

export async function parsePlist(filename: string) {
  const contents = await readFile(filename, { encoding: 'utf-8' });

  const parsed = plist.parse(contents);

  // If the plist is empty an empty array will come back
  // which is not what we want
  if (isEmpty(parsed)) {
    return {};
  }

  return parsed;
}


export function updatePlist(entries: any, parsed: any, replace = false) {
  const merged = mergeWith(parsed, entries, (objValue, srcValue) => {
    // Override the default merge behavior for arrays of objects that have the
    // same sub-key. Otherwise lodash merge doesn't work how we need it to
    if (Array.isArray(objValue)) {
      if (replace) {
        return srcValue;
      }

      const firstObjValue = objValue[0];
      const firstSrcValue = srcValue[0];

      // https://github.com/ionic-team/capacitor-configure/issues/32
      // When merging an array of dicts, like when modifying
      // CFBundleURLTypes, we don't want to union the two arrays because that
      // would result in duplicated array of dicts. Instead, we want to merge as-is.
      // This check makes sure we're not trying to union an array of dicts
      if (typeof firstObjValue !== 'object' && typeof firstSrcValue !== 'object') {
        return union(objValue, srcValue);
      }
    } else if (typeof objValue === 'object' && objValue !== null) {
      if (replace) {
        return srcValue;
      }
    }
  });

  return merged;
}
