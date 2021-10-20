import { Context } from '../../ctx';
import { IosOperation, Operation } from '../../op';

export default async function execute(ctx: Context, op: IosOperation) {
  const entries = op.value;

  for (const entry of entries) {
    ctx.project.ios.updateInfoPlist(op.target, op.build, entry);
  }
}