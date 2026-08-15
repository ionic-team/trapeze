import { pathExists, readFile } from '@ionic/utils-fs';
import { join } from 'path';

import { Context, loadContext } from '../../src/ctx';
import { Operation } from '../../src/definitions';
import Op from '../../src/operations/android/res';

import { makeOp, useFixture } from '../utils';

describe('op: android.res', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = await useFixture('ios-and-android');

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should write a resource file from text', async () => {
    const op = makeOp('android', 'res', [
      {
        path: 'raw',
        file: 'auth_config.json',
        text: '{ "client_id": "abc123" }',
      },
    ]);

    await Op(ctx, op as Operation);

    const file = await readFile(join(dir, 'android/app/src/main/res/raw/auth_config.json'), {
      encoding: 'utf-8',
    });
    expect(file).toBe('{ "client_id": "abc123" }');
  });

  it('should copy a resource file from a source file', async () => {
    const op = makeOp('android', 'res', [
      {
        path: 'drawable',
        file: 'icon.png',
        source: '../common/test/fixtures/icon.png',
      },
    ]);

    await Op(ctx, op as Operation);

    const copied = await readFile(join(dir, 'android/app/src/main/res/drawable/icon.png'));
    const source = await readFile('../common/test/fixtures/icon.png');
    expect(copied.equals(source)).toBe(true);
  });

  it('should warn and continue when a resource operation fails', async () => {
    const op = makeOp('android', 'res', [
      {
        path: 'drawable',
        file: 'missing.png',
        source: '../common/test/fixtures/does-not-exist.png',
      },
      {
        path: 'raw',
        file: 'auth_config.json',
        text: '{}',
      },
    ]);

    await Op(ctx, op as Operation);

    const file = await readFile(join(dir, 'android/app/src/main/res/raw/auth_config.json'), {
      encoding: 'utf-8',
    });
    expect(file).toBe('{}');
  });

  it('should not add a resource file on a dry run', async () => {
    ctx.args.dryRun = true;

    // dry_run_config.json must not exist in the fixture, or this assertion is vacuous
    const op = makeOp('android', 'res', [
      {
        path: 'raw',
        file: 'dry_run_config.json',
        text: '{ "client_id": "abc123" }',
      },
    ]);

    await Op(ctx, op as Operation);

    expect(await pathExists(join(dir, 'android/app/src/main/res/raw/dry_run_config.json'))).toBe(false);
  });
});
