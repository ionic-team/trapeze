import { readFile } from '@ionic/utils-fs';
import { XCConfigFile } from '@trapezedev/project';
import { join } from 'path';

import { Context, loadContext } from '../../src/ctx';
import { IosXCConfigOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/ios/xcconfig';

import { useFixture } from '../utils';

describe('op: ios.strings', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = await useFixture('ios-and-android');

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should set ios.xcconfig', async () => {
    const op: IosXCConfigOperation = {
      value: [
        {
          file: 'App/Config.xcconfig',
          set: {
            'PRODUCT_NAME': 'prod',
            'FOO[sdk=macosx*][arch=i386]': 'bar'
          },
        },
      ],
    };

    await Op(ctx, op as Operation);

    const file = ctx.project.vfs.get<XCConfigFile>(
      join(ctx.project.config.ios?.path ?? '', 'App', 'Config.xcconfig'),
    );
    expect(file?.getData()?.generate().trim()).toEqual(`
PRODUCT_NAME = prod
FOO[sdk=macosx*][arch=i386] = bar
`.trim());
  });

  it('should write xcconfig to disk on commit', async () => {
    const op: IosXCConfigOperation = {
      value: [
        {
          file: 'App/Config.xcconfig',
          set: {
            'PRODUCT_NAME': 'prod',
          },
        },
      ],
    };

    await Op(ctx, op as Operation);
    await ctx.project.commit();

    const contents = await readFile(
      join(ctx.project.config.ios?.path ?? '', 'App', 'Config.xcconfig'),
      { encoding: 'utf-8' },
    );
    expect(contents).toContain('PRODUCT_NAME = prod');
  });
});
