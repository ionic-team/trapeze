import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  for (let framework of op.value) {
    ctx.project.ios?.addFramework(op.iosTarget, framework);
  }
}
