import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const entitlements = op.value;

  await ctx.project.ios?.addEntitlements('App', 'Debug', entitlements);
  await ctx.project.ios?.addEntitlements('App', 'Release', entitlements);
}