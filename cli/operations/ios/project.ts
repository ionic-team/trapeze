import plist from 'plist';
import xcode from 'xcode';
import { join } from 'path';
import { readFile, writeFile } from '@ionic/utils-fs';

import { logger } from '../../util/log';

export default async function execute(ctx, op) {
  const filename = join(
    ctx.rootDir,
    'ios',
    'App',
    'App.xcodeproj',
    'project.pbxproj',
  );

  const proj = await parseProject(filename);
  // console.log(proj);

  const t1 = proj.getFirstTarget();

  if (op.id === 'ios.bundleId') {
    proj.updateBuildProperty(
      'PRODUCT_BUNDLE_IDENTIFIER',
      op.value,
      null,
      t1.name,
    );
  }

  if (op.id === 'ios.displayName') {
    // proj.updateProductName(op.value);
    await setDisplayName(ctx, op.value);
  }

  if (op.id === 'ios.productName') {
    proj.updateProductName(ctx, op.value);
  }

  await writeFile(filename, proj.writeSync());
}

function parseProject(filename): Promise<any> {
  const proj = xcode.project(filename);
  return new Promise((resolve, reject) => {
    proj.parse(err => {
      if (err) {
        return reject(err);
      }
      resolve(proj);
    });
  });
}

async function setDisplayName(ctx, displayName) {
  const parsed = await parsePlist(ctx);

  parsed['CFBundleDisplayName'] = displayName;

  await writePlist(ctx, plist.build(parsed));
}

async function parsePlist(ctx) {
  const filename = join(ctx.rootDir, 'ios', 'App', 'App', 'Info.plist');

  const contents = await readFile(filename, { encoding: 'utf-8' });

  return plist.parse(contents);
}

function writePlist(ctx, generated) {
  const filename = join(ctx.rootDir, 'ios', 'App', 'App', 'Info.plist');
  return writeFile(filename, generated);
}
