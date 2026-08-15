import { copy, pathExists, readFile, rm } from '@ionic/utils-fs';
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

  it('should set the package name', async () => {
    await Op(ctx, op);

    expect(await ctx.project.android?.getPackageName()).toBe('io.ionic.renamed');
  });

  it('should move the source tree to the new package', async () => {
    await Op(ctx, op);

    expect(await pathExists(join(dir, 'android/app/src/main/java/io/ionic/renamed'))).toBe(true);
    expect(await pathExists(join(dir, 'android/app/src/main/java/io/ionic/starter'))).toBe(false);
  });

  it('should rewrite the sources and manifest on commit', async () => {
    await Op(ctx, op);
    await ctx.project.commit();

    const sourceDir = join(dir, 'android/app/src/main/java');
    const activity = await readFile(join(sourceDir, 'io/ionic/renamed/MainActivity.java'), {
      encoding: 'utf-8',
    });
    expect(activity).toContain('package io.ionic.renamed;');

    const manifest = await readFile(join(dir, 'android/app/src/main/AndroidManifest.xml'), {
      encoding: 'utf-8',
    });
    expect(manifest).toContain('package="io.ionic.renamed"');
  });

  it('should not move source files on a dry run', async () => {
    ctx.args.dryRun = true;

    await Op(ctx, op);

    expect(await pathExists(join(dir, 'android/app/src/main/java/io/ionic/starter'))).toBe(true);
    expect(await pathExists(join(dir, 'android/app/src/main/java/io/ionic/renamed'))).toBe(false);
  });
});
