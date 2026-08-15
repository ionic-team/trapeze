import { copy, pathExists, rm } from '@ionic/utils-fs';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { Operation } from '../../src/definitions';
import Op from '../../src/operations/android/packageName';

import { makeOp } from '../utils';

describe('op: android.packageName', () => {
  let dir: string;
  let ctx: Context;
  let op: Operation;

  beforeEach(async () => {
    dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;

    op = makeOp('android', 'packageName', 'io.ionic.renamed');
  });

  afterEach(async () => {
    await rm(dir, { force: true, recursive: true });
  });

  it('should move the source tree to the new package', async () => {
    await Op(ctx, op);

    expect(await pathExists(join(dir, 'android/app/src/main/java/io/ionic/renamed'))).toBe(true);
    expect(await pathExists(join(dir, 'android/app/src/main/java/io/ionic/starter'))).toBe(false);
  });

  it('should not move source files on a dry run', async () => {
    ctx.args.dryRun = true;

    await Op(ctx, op);

    expect(await pathExists(join(dir, 'android/app/src/main/java/io/ionic/starter'))).toBe(true);
    expect(await pathExists(join(dir, 'android/app/src/main/java/io/ionic/renamed'))).toBe(false);
  });
});
