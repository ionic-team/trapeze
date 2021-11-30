import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const entitlements = op.value;

  for (const entitlement of entitlements) {
    await ctx.project.ios?.addEntitlements('App', 'Debug', entitlement);
    await ctx.project.ios?.addEntitlements('App', 'Release', entitlement);
  }
}