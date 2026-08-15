import { copy, rm } from '@ionic/utils-fs';
import { temporaryDirectory } from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { Operation } from '../../src/definitions';
import Op from '../../src/operations/ios/frameworks';

import { makeOp } from '../utils';

describe('op: ios.frameworks', () => {
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

  it('should add frameworks to the app target', async () => {
    const op = makeOp('ios', 'frameworks', [
      'ImageIO.framework',
      'libsqlite3.tbd',
    ]);

    await Op(ctx, op as Operation);

    expect(ctx.project.ios?.getFrameworks(null)).toEqual(
      expect.arrayContaining(['ImageIO.framework', 'libsqlite3.tbd']),
    );
  });

  it('should add frameworks to a non-app target', async () => {
    const op: Operation = {
      ...makeOp('ios', 'frameworks', ['WebKit.framework']),
      iosTarget: 'My App Clip',
    };

    await Op(ctx, op);

    expect(ctx.project.ios?.getFrameworks('My App Clip')).toContain('WebKit.framework');
    expect(ctx.project.ios?.getFrameworks('App')).not.toContain('WebKit.framework');
  });
});
