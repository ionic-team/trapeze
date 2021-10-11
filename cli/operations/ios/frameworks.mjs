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

  const p1 = proj.getFirstProject();

  const frameworks = op.value;

  for (let framework of frameworks) {
    proj.addFramework(framework, {
      embed: false,
    });
  }

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
