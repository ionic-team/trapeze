import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  return ctx.project.android?.setPackageName(op.value);
}
