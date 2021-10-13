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

  for (const key of Object.keys(op.value)) {
    let v = op.value[key];
    if (typeof v === 'boolean') {
      v = v ? 'YES' : 'NO';
    }
    proj.addBuildProperty(key, v, 'Debug');
    proj.addBuildProperty(key, v, 'Release');
  }

  await ionicFs.writeFile(filename, proj.writeSync());
}
