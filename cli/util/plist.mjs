import { mergeWith, union } from 'lodash-es';
import { str } from '../ctx.mjs';

export function updatePlist(ctx, entries, parsed) {
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

      // Return an array of unique entries
      // return union(objValue.map(o => str(ctx, o)).concat(srcValue));
      return union(objValue).concat(srcValue);
    }
  });

  return merged;
}
