import { copy } from '@ionic/utils-fs';
import { GradleFile } from '@trapezedev/project/dist/android/gradle-file';
import { join } from 'path';
import tempy from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { AndroidGradleOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/android/gradle';

const makeOp = (name: string, value: any): Operation => ({
  id: `android.${name}`,
  platform: 'android',
  name,
  value,
  iosTarget: null,
  iosBuild: null,
  displayText: expect.anything(),
});

describe('op: android.gralde', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = tempy.directory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('Should replace', async () => {
    const op: AndroidGradleOperation = makeOp('gradle', [
      {
        file: 'app/build.gradle',
        target: {
          android: {
            buildTypes: {
              implementation: {}
            }
          }
        },
        replace: {
          implementation: "'test-implementation'"
        }
      },
    ]);

    await Op(ctx, op as Operation);

    console.log('Did op', ctx.project.vfs.all());

    const file = ctx.project.vfs.get<GradleFile>(join(dir, 'android/app/build.gradle'));
    expect(file?.getData()?.getDocument()).toEqual({
      client: [],
      project_info: {
        project_id: 'my-id',
      },
    });
  });
});