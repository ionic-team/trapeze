import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const entry = op.value;

  for (const entries of entry.entries) {
    await ctx.project.ios?.updateInfoPlist(op.iosTarget, op.iosBuild, entries, {
      replace: entry.replace ?? false
    });
  }
}