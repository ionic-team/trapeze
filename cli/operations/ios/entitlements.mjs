import plist from 'plist';
import { join } from 'path';
import ionicFs from '@ionic/utils-fs';
import { updatePlist } from '../../util/plist.mjs';

const defaultEntitlementsPlist = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
</dict>
</plist>
`;

export default async function execute(ctx, op) {
  const entitlements = op.value;

  const filename = join(ctx.rootDir, 'ios', 'App', 'App', 'app.entitlements');

  if (!(await ionicFs.pathExists(filename))) {
    await writeFile(filename, defaultEntitlementsPlist);
  }

  const parsed = await parsePlist(ctx, op, filename);

  let modified = parsed;
  for (const ent of entitlements) {
    modified = addEntitlement(ctx, ent, modified);
  }
  const generated = plist.build(modified);
  await writePlist(filename, generated);
}

async function parsePlist(_ctx, _op, filename) {
  const contents = await ionicFs.readFile(filename, { encoding: 'utf-8' });

  return plist.parse(contents);
}

function addEntitlement(ctx, entitlement, parsed) {
  return updatePlist(ctx, entitlement, parsed);
}

function writePlist(filename, generated) {
  return ionicFs.writeFile(filename, generated);
}
