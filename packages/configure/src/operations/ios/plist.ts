import { Context } from '../../ctx';
import { IosPlistOperationValue, Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const plistOp = op.value as IosPlistOperationValue;

  for (const op of plistOp) {
    if (op.file) {
      const file = await ctx.project.ios?.getPlistFile(op.file);
      if (!file) {
        throw new Error(`No such plist file for plist operation: ${op.file}`);
      }

      await file.load();

      for (const entries of op.entries) {
        if (op.replace) {
          file.set(entries);
        } else {
          file.merge(entries);
        }
      }
    } else {
      for (const entries of op.entries) {
        await ctx.project.ios?.updateInfoPlist(op.iosTarget ?? null, op.iosBuild ?? null, entries, {
          replace: op.replace ?? false
        });
      }
    }
  }
}