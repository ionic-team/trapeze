import { join } from 'path';

import { Context, loadContext } from '../../src/ctx';
import { Operation } from '../../src/definitions';
import Op from '../../src/operations/android/version';
import { makeOp, useFixture } from '../utils';

describe('op: android.versionCode', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = await useFixture('ios-and-android');

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('shouldn\'t break build when updating empty versionCode', async () => {
    const op: Operation = makeOp('android', 'versionCode', '');
    await Op(ctx, op as Operation);
    expect(await ctx.project.android?.getVersionCode()).toBe(1);
  });

  it('should update versionCode', async () => {
    const op: Operation = makeOp('android', 'versionCode', 1337);
    await Op(ctx, op as Operation);
    expect(await ctx.project.android?.getVersionCode()).toBe(1337);
  });

});
