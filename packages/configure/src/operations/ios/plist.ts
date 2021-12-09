import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const plistOp = op.value;

  // Support arrays of ops or single ops

  if (Array.isArray(plistOp)) {
    for (const op of plistOp) {
      for (const entries of op.entries) {
        await ctx.project.ios?.updateInfoPlist(op.iosTarget, op.iosBuild, entries, {
          replace: op.replace ?? false
        });
      }
    }
  } else {
    for (const entries of plistOp.entries) {
      await ctx.project.ios?.updateInfoPlist(op.iosTarget, op.iosBuild, entries, {
        replace: plistOp.replace ?? false
      });
    }
  }
}