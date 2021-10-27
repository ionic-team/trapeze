import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const entries = op.value;

  for (const entry of entries) {
    ctx.project.ios?.updateInfoPlist(op.iosTarget, op.iosBuild, entry);
  }
}