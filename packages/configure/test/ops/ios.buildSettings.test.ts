import { copy, rm } from '@ionic/utils-fs';
import { temporaryDirectory } from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { Operation } from '../../src/definitions';
import Op from '../../src/operations/ios/buildSettings';

import { makeOp } from '../utils';

describe('op: ios.buildSettings', () => {
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

  it('should set build settings', async () => {
    const op = makeOp('ios', 'buildSettings', {
      SWIFT_VERSION: '5.0',
      DEVELOPMENT_TEAM: 'ABCD1234',
    });

    await Op(ctx, op as Operation);

    expect(ctx.project.ios?.getBuildProperty(null, null, 'SWIFT_VERSION')).toBe('5.0');
    expect(ctx.project.ios?.getBuildProperty(null, null, 'DEVELOPMENT_TEAM')).toBe('ABCD1234');
  });

  it('should write build settings to the pbxproj on commit', async () => {
    const op = makeOp('ios', 'buildSettings', {
      SWIFT_VERSION: '5.0',
    });

    await Op(ctx, op as Operation);
    await ctx.project.commit();

    const reloaded = await loadContext(dir);
    expect(reloaded.project.ios?.getBuildProperty(null, null, 'SWIFT_VERSION')).toBe('5.0');
  });

  // Xcode has no boolean type, build settings are the strings YES and NO
  it('should convert booleans to YES and NO', async () => {
    const op = makeOp('ios', 'buildSettings', {
      ENABLE_BITCODE: false,
      SWIFT_COMPILATION_MODE: true,
    });

    await Op(ctx, op as Operation);

    expect(ctx.project.ios?.getBuildProperty(null, null, 'ENABLE_BITCODE')).toBe('NO');
    expect(ctx.project.ios?.getBuildProperty(null, null, 'SWIFT_COMPILATION_MODE')).toBe('YES');
  });

  it('should set build settings for a single build configuration', async () => {
    const op: Operation = {
      ...makeOp('ios', 'buildSettings', { FAKE_PROPERTY: 'debug only' }),
      iosTarget: 'App',
      iosBuild: 'Debug',
    };

    await Op(ctx, op);

    expect(ctx.project.ios?.getBuildProperty('App', 'Debug', 'FAKE_PROPERTY')).toBe('debug only');
    expect(ctx.project.ios?.getBuildProperty('App', 'Release', 'FAKE_PROPERTY')).not.toBe('debug only');
  });
});
