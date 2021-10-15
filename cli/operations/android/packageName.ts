import { join } from 'path';
import { Change } from '../../../lib/change';
import { Context } from '../../ctx';

export default async function execute(ctx: Context, op): Promise<Change[]> {
  const filename = join(
    ctx.rootDir,
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml',
  );

  const change = await ctx.project.android.setPackageName(op.value);

  return [change];
}
