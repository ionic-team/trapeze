import { copy, pathExists, readFile } from '@ionic/utils-fs';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { CopyOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/project/copy';

const copyOp: CopyOperation = {
  value: [
    {
      src: 'capacitor.config.ts',
      dest: 'capacitor.config.ts.copy'
    },
  ],
};

describe('op: project.copy', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should copy files', async () => {
    await Op(ctx, copyOp as Operation);

    const oldFile = await readFile(join(dir, 'capacitor.config.ts'), { encoding: 'utf-8' });
    const newFile = await readFile(join(dir, 'capacitor.config.ts.copy'), { encoding: 'utf-8' });

    expect(oldFile).toBe(newFile);
  });

  it('should not copy files on a dry run', async () => {
    ctx.args.dryRun = true;

    await Op(ctx, copyOp as Operation);

    expect(await pathExists(join(dir, 'capacitor.config.ts.copy'))).toBe(false);
  });

  it('should not copy files when not committing', async () => {
    ctx.args.commit = false;

    await Op(ctx, copyOp as Operation);

    expect(await pathExists(join(dir, 'capacitor.config.ts.copy'))).toBe(false);
  });
});
