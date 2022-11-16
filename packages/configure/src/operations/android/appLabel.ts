import { Context } from '../../ctx';
import { AndroidAppLabelOperation, Operation } from '../../definitions';
import { logger } from '../../util/log';

export default async function execute(ctx: Context, op: Operation) {
  const o = op as AndroidAppLabelOperation;

  try {
    await ctx.project.android?.setAppLabel(o.value);
  } catch (e) {
    logger.warn(`Unable to set appLabel: ${(e as any).message}`);
  }
}
