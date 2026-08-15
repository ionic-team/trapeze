import { copy, pathExists, readFile, rm } from '@ionic/utils-fs';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { AndroidCopyOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/android/copy';

import { makeOp } from '../utils';

describe('op: android.copy', () => {
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

  it('should copy file', async () => {
    makeOp
    const op: AndroidCopyOperation = makeOp('android', 'copy', 
      [
        {
          src: 'variables.gradle',
          dest: 'variables2.gradle',
        },
      ],
    );

    await Op(ctx, op as Operation);
    const src = join(dir, 'android', 'variables.gradle');
    const srcContents = await readFile(src);
    const dest = join(dir, 'android', 'variables2.gradle');
    const destContents = await readFile(dest);
    expect(srcContents).toEqual(destContents);
  });

  it('should not copy file on a dry run', async () => {
    ctx.args.dryRun = true;

    const op: AndroidCopyOperation = makeOp('android', 'copy',
      [
        {
          src: 'variables.gradle',
          dest: 'variables2.gradle',
        },
      ],
    );

    await Op(ctx, op as Operation);

    expect(await pathExists(join(dir, 'android', 'variables2.gradle'))).toBe(false);
  });
});
