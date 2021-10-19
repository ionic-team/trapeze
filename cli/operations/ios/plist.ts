import { Context } from '../../ctx';
import { Operation } from '../../op';

export default async function execute(ctx: Context, op: Operation) {
  const entries = op.value;

  for (const entry of entries) {
    const { file } = entry;
    /*
    if (file === 'Info.plist') {
      const filename = join(ctx.rootDir, 'ios', 'App', 'App', 'Info.plist');

      const parsed = await parsePlist(ctx, op, filename);

      const modified = await updatePlist(entry, parsed);
      const generated = plist.build(modified);
      await writePlist(ctx, filename, generated);
    } else {
      throw new Error(`Unknown plist file ${file}`);
    }
    */
  }

  return [];
}