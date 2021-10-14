import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

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

  if (op.id === 'ios.buildNumber') {
    proj.addBuildProperty('CURRENT_PROJECT_VERSION', op.value, 'Debug');
    proj.addBuildProperty('CURRENT_PROJECT_VERSION', op.value, 'Release');
  }

  if (op.id === 'ios.incrementBuild' && op.value === true) {
    const num = proj.getBuildProperty('CURRENT_PROJECT_VERSION', 'Debug');
    const num2 = proj.getBuildProperty('CURRENT_PROJECT_VERSION', 'Release');

    if (num) {
      proj.addBuildProperty('CURRENT_PROJECT_VERSION', num + 1, 'Debug');
      proj.addBuildProperty('CURRENT_PROJECT_VERSION', num + 1, 'Release');
    } else {
      proj.addBuildProperty('CURRENT_PROJECT_VERSION', 1, 'Debug');
      proj.addBuildProperty('CURRENT_PROJECT_VERSION', 1, 'Release');
    }
  }

  await ionicFs.writeFile(filename, proj.writeSync());
}
