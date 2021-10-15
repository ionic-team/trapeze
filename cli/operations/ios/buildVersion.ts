import { Context } from '../../ctx';
import { Operation } from '../../op';
import { Change } from '../../../lib/change';

export default async function execute(ctx: Context, op: Operation): Promise<Change> {
  // TODO: Don't hard code the build names
  if (op.id === 'ios.version') {
    return ctx.project.ios.setVersion(op.value, 'Debug');
  }
  if (op.id === 'ios.buildNumber') {
    return ctx.project.ios.setBuild(op.value, 'Debug');
  }
  if (op.id === 'ios.incrementBuild' && op.value === true) {
    return ctx.project.ios.incrementBuild('Debug');
  }
}
