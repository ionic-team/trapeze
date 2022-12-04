import { copy } from '@ionic/utils-fs';
import { StringsFile } from '@trapezedev/project';
import { join } from 'path';
import tempy from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { IosXCConfigOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/ios/xcconfig';

describe('op: ios.strings', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = tempy.directory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should set ios.strings', async () => {
    const op: IosXCConfigOperation = {
      value: [
        {
          file: 'App/Localizable.strings',
          set: {
            'Insert Element': 'Insert Element 2'
          },
        },
      ],
    };

    await Op(ctx, op as Operation);

    const file = ctx.project.vfs.get<StringsFile>(
      join(ctx.project.config.ios?.path ?? '', 'App', 'Localizable.strings'),
    );
    expect(file?.getData()?.generate()).toEqual(`
/* Insert Element menu item */

"Insert Element" = "Insert Element 2";

/* Error string used for unknown error types. */

"ErrorString_1" = "An unknown error occurred.";
`.trim());
  });

  it('should create new xcconfig file if one does not exist', async () => {
    const op: IosXCConfigOperation = {
      value: [
        {
          file: 'App/New.strings',
          set: {
          }
        },
      ],
    };

    await Op(ctx, op as Operation);

    const file = ctx.project.vfs.get<StringsFile>(
      join(ctx.project.config.ios?.path ?? '', 'App', 'New.strings'),
    );
    const generated = file?.getData()?.generate();
    expect(generated).toEqual(`
"Insert Element" = "New3";

"ErrorString_1" = "New4";
`.trim());
  });
});
