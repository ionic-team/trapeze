import { Context } from '../../ctx';
import { AndroidOperation } from '../../op';

export default async function execute(ctx: Context, op: AndroidOperation) {
  ctx.project.android.setPackageName(op.value);
}
