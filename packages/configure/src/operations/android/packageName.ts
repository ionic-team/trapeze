import { Context } from '../../ctx';
import { Operation, OperationMeta } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  return ctx.project.android?.setPackageName(op.value);
}

export const OPS: OperationMeta = [
  'android.packageName'
]