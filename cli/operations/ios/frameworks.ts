import { Context } from '../../ctx';
import { IosOperation, Operation } from '../../op';

export default async function execute(ctx: Context, op: IosOperation) {
  for (let framework of op.value) {
    ctx.project.ios.addFramework(op.target, framework);
  }
}
