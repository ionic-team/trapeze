import { join } from 'path';
import { writeFile } from '@ionic/utils-fs';

import { parsePbxProject } from '../../../lib/util/pbx';
import { Context } from '../../ctx';
import { Operation } from '../../op';

export default async function execute(ctx: Context, op: Operation) {
  /*
  const iosProject = ctx.project.ios;

  const changes: Change[] = [];
  for (const key of Object.keys(op.value)) {
    let v = op.value[key];
    if (typeof v === 'boolean') {
      v = v ? 'YES' : 'NO';
    }

    await iosProject.setBuildProperty(key, v, 'Debug');
  }
  */
}
