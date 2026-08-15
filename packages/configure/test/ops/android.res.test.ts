import { copy, pathExists, readFile, rm } from '@ionic/utils-fs';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { Operation } from '../../src/definitions';
import Op from '../../src/operations/android/res';

import { makeOp } from '../utils';

describe('op: android.res', () => {
  let dir: string;
  let ctx: Context;
  let resFile: string;
  let op: Operation;

  beforeEach(async () => {
    dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;

    resFile = join(dir, 'android/app/src/main/res/raw/test_config.json');
    op = makeOp('android', 'res', [
      {
        path: 'raw',
        file: 'test_config.json',
        text: '{ "client_id": "test" }',
      },
    ]);
  });

  afterEach(async () => {
    await rm(dir, { force: true, recursive: true });
  });

  it('should add a resource file', async () => {
    await Op(ctx, op);

    expect(await readFile(resFile, { encoding: 'utf-8' })).toBe('{ "client_id": "test" }');
  });

  it('should not add a resource file on a dry run', async () => {
    ctx.args.dryRun = true;

    await Op(ctx, op);

    expect(await pathExists(resFile)).toBe(false);
  });
});
