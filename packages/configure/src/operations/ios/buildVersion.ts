import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  if (op.id === 'ios.version') {
    ctx.project.ios?.setVersion(op.iosTarget, op.iosBuild, op.value);
  }
  if (op.id === 'ios.buildNumber') {
    ctx.project.ios?.setBuild(op.iosTarget, op.iosBuild, op.value);
  }
  if (op.id === 'ios.incrementBuild' && op.value === true) {
    ctx.project.ios?.incrementBuild(op.iosTarget, op.iosBuild);
  }
}
