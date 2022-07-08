import { Context } from '../../ctx';
import { IosPlistOperationValue, Operation } from '../../definitions';

// The older form of the plist operation, kept for backwards compat
export default async function execute(ctx: Context, op: Operation) {
  const plistOp = op.value as IosPlistOperationValue;

  if (Array.isArray(plistOp)) {
    for (const op of plistOp) {
      for (const entries of op.entries) {
        await ctx.project.ios?.updateInfoPlist(op.iosTarget, op.iosBuild, entries, {
          replace: op.replace ?? false
        });
      }
    }
  }
}