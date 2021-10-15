import { join } from 'path';
import { mkdir, pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { Context } from '../../ctx';
import { Operation } from '../../op';
import { Change } from '../../../lib/change';

export default async function execute(ctx: Context, op: Operation): Promise<Change[]> {
  const resRoot = join(ctx.rootDir, 'android', 'app', 'src', 'main', 'res');

  const resOps = op.value;

  for (let resOp of resOps) {
    const resDir = join(resRoot, resOp.path);
    if (!(await pathExists(resDir))) {
      await mkdir(resDir);
    }

    // Raw text supplied, write it
    if (resOp.text) {
      await writeFile(join(resDir, resOp.file), resOp.text);
    } else if (resOp.source) {
      const sourceData = await readFile(resOp.source);
      await writeFile(join(resDir, resOp.file), sourceData);
    }
  }

  return [];
}
