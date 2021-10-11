import xcode from 'xcode';
import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

import { logger } from '../../util/log.mjs';

export default async function execute({ env }, op) {
  const filename = join(
    env.rootDir,
    'ios',
    'App',
    'App.xcodeproj',
    'project.pbxproj',
  );

  const proj = await parseProject(filename);
  console.log(proj);

  const p1 = proj.getFirstProject();
  console.log(p1);

  const t1 = proj.getFirstTarget();
  console.log(t1);

  console.log(
    proj.getBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', undefined, t1.name),
  );

  proj.updateBuildProperty(
    'PRODUCT_BUNDLE_IDENTIFIER',
    op.value,
    null,
    t1.name,
  );

  await ionicFs.writeFile(filename, proj.writeSync());
}

function parseProject(filename) {
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
