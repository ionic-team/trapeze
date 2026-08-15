import { pathExists, readFile } from '@ionic/utils-fs';
import { join } from 'path';

import { Context, loadContext } from '../../src/ctx';
import { IosCopyOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/ios/copy';

import { makeOp, useFixture } from '../utils';

describe('op: ios.copy', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = await useFixture('ios-and-android');

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should copy file', async () => {
    makeOp
    const op: IosCopyOperation = makeOp('ios', 'copy',
      [
        {
          src: 'json-file.json',
          dest: 'json-file2.json',
        },
      ],
    );

    await Op(ctx, op as Operation);
    const src = join(dir, 'ios/App', 'json-file.json');
    const srcContents = await readFile(src);
    const dest = join(dir, 'ios/App', 'json-file2.json');
    const destContents = await readFile(dest);
    expect(srcContents).toEqual(destContents);
  });

  it('should not copy file on a dry run', async () => {
    ctx.args.dryRun = true;

    const op: IosCopyOperation = makeOp('ios', 'copy',
      [
        {
          src: 'json-file.json',
          dest: 'json-file2.json',
        },
      ],
    );

    await Op(ctx, op as Operation);

    expect(await pathExists(join(dir, 'ios/App', 'json-file2.json'))).toBe(false);
  });
});
