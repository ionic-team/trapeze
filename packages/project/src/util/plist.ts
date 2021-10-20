import plist from 'plist';
import { readFile } from '@ionic/utils-fs';
import { mergeWith, union } from 'lodash';

export async function parsePlist(filename: string) {
  const contents = await readFile(filename, { encoding: 'utf-8' });

  return plist.parse(contents);
}


export function updatePlist(entries: any, parsed: any) {
  // const converted = toPlistFormat({ ...opData });
  const merged = mergeWith(entries, parsed, (objValue, srcValue) => {
    // Override the default merge behavior for arrays of objects that have the
    // same sub-key. Otherwise lodash merge doesn't work how we need it to
    if (Array.isArray(objValue)) {
      const subObjectObj = objValue[0];
      const subObjectSrc = srcValue[0];

      if (
        typeof subObjectObj === 'object' &&
        typeof subObjectSrc === 'object'
      ) {
        if (Object.keys(subObjectObj)[0] === Object.keys(subObjectSrc)[0]) {
          return undefined;
        }
      }

      return union(objValue).concat(srcValue);
    }
  });

  return merged;
}
