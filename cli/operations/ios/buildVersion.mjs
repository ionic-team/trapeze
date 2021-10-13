import xcode from 'xcode';
import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

import { logger } from '../../util/log.mjs';
import { parsePbxProject } from '../../util/pbx.mjs';

export default async function execute(ctx, op) {
  const filename = join(
    ctx.rootDir,
    'ios',
    'App',
    'App.xcodeproj',
    'project.pbxproj',
  );

  const proj = await parsePbxProject(filename);

  if (op.id === 'ios.version') {
    proj.addBuildProperty('MARKETING_VERSION', op.value, 'Debug');
    proj.addBuildProperty('MARKETING_VERSION', op.value, 'Release');
  }

  if (op.id === 'ios.build') {
    proj.addBuildProperty('CURRENT_PROJECT_VERSION', op.value, 'Debug');
    proj.addBuildProperty('CURRENT_PROJECT_VERSION', op.value, 'Release');
  }

  await ionicFs.writeFile(filename, proj.writeSync());
}
