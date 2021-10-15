import { join } from 'path';
import { writeFile } from '@ionic/utils-fs';

import { parsePbxProject } from '../../util/pbx';
import { Context } from '../../ctx';
import { Operation } from '../../op';
import { Change } from '../../../lib/change';

export default async function execute(ctx: Context, op: Operation): Promise<Change[]> {
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

  await writeFile(filename, proj.writeSync());

  return [];
}
