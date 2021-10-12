import plist from 'plist';
import { join } from 'path';
import ionicFs from '@ionic/utils-fs';
import { updatePlist } from '../../util/plist.mjs';

export default async function execute(ctx, op) {
  const entitlements = op.value;

  const filename = join(ctx.rootDir, 'ios', 'App', 'App', 'app.entitlements');

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
  console.log('Adding entitlement', entitlement);
  return updatePlist(ctx, entitlement, parsed);
}

function writePlist(filename, generated) {
  return ionicFs.writeFile(filename, generated);
}
