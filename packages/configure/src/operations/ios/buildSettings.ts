import { Context } from '../../ctx';
import { Operation } from '../../definitions';
import { logger } from '../../util/log';

export default async function execute(ctx: Context, op: Operation) {
  for (const key of Object.keys(op.value)) {
    let v = op.value[key];
    if (typeof v === 'boolean') {
      v = v ? 'YES' : 'NO';
    }
    try {
      ctx.project.ios?.setBuildProperty(op.iosTarget, op.iosBuild, key, v);
    } catch (e) {
      logger.warn(`Skipping ${op.id} (${(e as any).message})`);
    }
  }
}
