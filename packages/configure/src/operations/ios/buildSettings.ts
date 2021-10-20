import { Context } from '../../ctx';
import { IosOperation } from '../../op';

export default async function execute(ctx: Context, op: IosOperation) {
  for (const key of Object.keys(op.value)) {
    let v = op.value[key];
    if (typeof v === 'boolean') {
      v = v ? 'YES' : 'NO';
    }
    ctx.project.ios.setBuildProperty(op.target, op.build, key, v);
  }
}
