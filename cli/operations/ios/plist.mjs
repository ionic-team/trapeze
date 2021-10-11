import plist from 'plist';
import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

import { mergeWith, union } from 'lodash-es';

export default async function execute(ctx, op) {
  const entries = op.value;

  for (const entry of entries) {
    const { file } = entry;
    if (file === 'Info.plist') {
      const filename = join(ctx.env.rootDir, 'ios', 'App', 'App', 'Info.plist');

      const parsed = await parsePlist(ctx, op, filename);

      const modified = await modifyParsedPlist(entry, parsed);
      const generated = plist.build(modified);
      await writePlist(ctx, filename, generated);
    } else {
      throw new Error(`Unknown plist file ${file}`);
    }
  }
}

async function parsePlist(_ctx, _op, filename) {
  const contents = await ionicFs.readFile(filename, { encoding: 'utf-8' });

  return plist.parse(contents);
}

function writePlist(_ctx, filename, generated) {
  return ionicFs.writeFile(filename, generated);
}

function modifyParsedPlist(opData, parsed) {
  // const converted = toPlistFormat({ ...opData });
  const merged = mergeWith(opData.entries, parsed, (objValue, srcValue) => {
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
      return union(objValue.concat(srcValue));
    }
  });

  return merged;
}
