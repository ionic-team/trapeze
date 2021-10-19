import { join } from 'path';
import { mkdir, pathExists, readFile, writeFile } from '@ionic/utils-fs';
import { Context } from '../../ctx';
import { Operation } from '../../op';

export default async function execute(ctx: Context, op: Operation) {
  const resOps = op.value;

  for (let resOp of resOps) {
    if (resOp.text) {
      const { path, file, text } = resOp;
      await ctx.project.android.addResource(path, file, text);
    } else if (resOp.source) {
      const { path, file, source } = resOp;
      await ctx.project.android.copyToResources(path, file, source);
    }
  }

  return [];
}
