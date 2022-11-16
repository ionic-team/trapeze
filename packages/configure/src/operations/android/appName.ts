import { Context } from '../../ctx';
import { AndroidAppNameOperation, Operation } from '../../definitions';
import { logger } from '../../util/log';

export default async function execute(ctx: Context, op: Operation) {
  const o = op as AndroidAppNameOperation;

  try {
    await ctx.project.android?.setAppName(o.value);
  } catch (e) {
    logger.warn(`Unable to set appName: ${(e as any).message}`);
  }
}
