import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  if (op.id === 'ios.bundleId') {
    return ctx.project.ios.setBundleId(op.iosTarget, op.iosBuild, op.value);
  }

  if (op.id === 'ios.displayName') {
    return ctx.project.ios.setDisplayName(op.iosTarget, op.iosBuild, op.value);
  }

  if (op.id === 'ios.productName') {
    return ctx.project.ios.setProductName(op.iosTarget, op.value);
  }
}