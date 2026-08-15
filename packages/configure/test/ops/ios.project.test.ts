import { copy, rm } from '@ionic/utils-fs';
import { temporaryDirectory } from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { Operation } from '../../src/definitions';
import Op from '../../src/operations/ios/project';

import { makeOp } from '../utils';

describe('op: ios.bundleId/displayName/productName', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  afterEach(async () => {
    await rm(dir, { force: true, recursive: true });
  });

  it('should set the bundle id', async () => {
    const op = makeOp('ios', 'bundleId', 'io.ionic.betterBundleId');

    await Op(ctx, op as Operation);

    expect(ctx.project.ios?.getBundleId('App', 'Debug')).toBe('io.ionic.betterBundleId');
    expect(ctx.project.ios?.getBundleId('App', 'Release')).toBe('io.ionic.betterBundleId');
  });

  it('should set the bundle id of a single target', async () => {
    const op: Operation = {
      ...makeOp('ios', 'bundleId', 'io.ionic.clipBundleId'),
      iosTarget: 'My App Clip',
    };

    await Op(ctx, op);

    expect(ctx.project.ios?.getBundleId('My App Clip')).toBe('io.ionic.clipBundleId');
    expect(ctx.project.ios?.getBundleId('App')).toBe('io.ionic.wowzaStarter');
  });

  it('should set the display name', async () => {
    const op = makeOp('ios', 'displayName', 'My Awesome App');

    await Op(ctx, op as Operation);

    expect(await ctx.project.ios?.getDisplayName('App')).toBe('My Awesome App');
  });

  // setProductName writes the PRODUCT_NAME build setting, getProductName reads the
  // pbx target attribute, so the build property is what has to be asserted here
  it('should set the product name', async () => {
    const op = makeOp('ios', 'productName', 'Awesome App');

    await Op(ctx, op as Operation);

    expect(ctx.project.ios?.getBuildProperty('App', null, 'PRODUCT_NAME')).toBe('Awesome App');
  });

  it('should warn instead of throwing when the target does not exist', async () => {
    const op: Operation = {
      ...makeOp('ios', 'bundleId', 'io.ionic.betterBundleId'),
      iosTarget: 'No Such Target',
    };

    await expect(Op(ctx, op)).resolves.toBeUndefined();
    expect(ctx.project.ios?.getBundleId('App')).toBe('io.ionic.wowzaStarter');
  });
});
