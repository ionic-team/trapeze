import { Context } from '../../ctx';
import { IosOperation } from '../../op';

export default async function execute(ctx: Context, op: IosOperation) {
  if (op.id === 'ios.version') {
    ctx.project.ios.setVersion(op.target, op.build, op.value);
  }
  if (op.id === 'ios.buildNumber') {
    ctx.project.ios.setBuild(op.target, op.build, op.value);
  }
  if (op.id === 'ios.incrementBuild' && op.value === true) {
    ctx.project.ios.incrementBuild(op.target, op.build);
  }
}
