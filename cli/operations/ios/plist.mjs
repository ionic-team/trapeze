import plist from 'plist';
import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

import { mergeWith, union } from 'lodash-es';
import { updatePlist } from '../../util/plist.mjs';

export default async function execute(ctx, op) {
  const entries = op.value;

  for (const entry of entries) {
    const { file } = entry;
    if (file === 'Info.plist') {
      const filename = join(ctx.rootDir, 'ios', 'App', 'App', 'Info.plist');

      const parsed = await parsePlist(ctx, op, filename);

      const modified = await updatePlist(entry, parsed);
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
