import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  for (const key of Object.keys(op.value)) {
    let v = op.value[key];
    if (typeof v === 'boolean') {
      v = v ? 'YES' : 'NO';
    }
    ctx.project.ios?.setBuildProperty(op.iosTarget, op.iosBuild, key, v);
  }
}
