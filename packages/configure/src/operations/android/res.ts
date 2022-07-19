import { Context } from '../../ctx';
import { Operation } from '../../definitions';
import { logger } from '../../util/log';

export default async function execute(ctx: Context, op: Operation) {
  const resOps = op.value;

  for (let resOp of resOps) {
    try {
      if (resOp.text) {
        const { path, file, text } = resOp;
        await ctx.project.android?.addResource(path, file, text);
      } else if (resOp.source) {
        const { path, file, source } = resOp;
        await ctx.project.android?.copyToResources(path, file, source);
      }
    } catch (e) {
      logger.warn(`Skipping resource file operation: ${(e as any).message}`);
    }
  }

  return [];
}
