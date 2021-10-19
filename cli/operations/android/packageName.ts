import { join } from 'path';
import { Context } from '../../ctx';

export default async function execute(ctx: Context, op) {
  ctx.project.android.setPackageName(op.value);
}
