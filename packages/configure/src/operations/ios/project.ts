import { Context } from '../../ctx';
import { Operation } from '../../definitions';
import { logger, warn } from '../../util/log';

export default async function execute(ctx: Context, op: Operation) {
  try {
    if (op.id === 'ios.bundleId') {
      await ctx.project.ios?.setBundleId(op.iosTarget, op.iosBuild, op.value);
    }

    if (op.id === 'ios.displayName') {
      await ctx.project.ios?.setDisplayName(op.iosTarget, op.iosBuild, op.value);
    }

    if (op.id === 'ios.productName') {
      await ctx.project.ios?.setProductName(op.iosTarget, op.value);
    }
  } catch (e) {
    logger.warn(`Skipping ${op.id} (${(e as any).message})`);
  }
}