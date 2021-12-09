import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const entitlements = op.value;

  const build = op.iosBuild;

  for (const entitlement of entitlements) {
    if (build) {
      // If build is specified, apply only to that build
      await ctx.project.ios?.addEntitlements(op.iosTarget, build, entitlement);
    } else {
      // Otherwise, apply to both debug and release builds
      await ctx.project.ios?.addEntitlements(op.iosTarget, 'Debug', entitlement);
      await ctx.project.ios?.addEntitlements(op.iosTarget, 'Release', entitlement);
    }
  }
}