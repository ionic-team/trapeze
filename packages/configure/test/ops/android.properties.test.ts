import { copy, readFile } from '@ionic/utils-fs';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';
import { PropertiesFile } from '@trapezedev/project';

import { Context, loadContext } from '../../src/ctx';
import { AndroidPropertiesOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/android/properties';

describe('op: android.properties', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should set android.properties', async () => {
    const op: AndroidPropertiesOperation = {
      value: [
        {
          file: 'gradle.properties',
          entries: {
            'org.gradle.jvmargs': 'test',
          },
        },
      ],
    };

    await Op(ctx, op as Operation);

    const file = ctx.project.vfs.get<PropertiesFile>(join(dir, 'android/gradle.properties'));
    expect(file?.getData()?.getProperties()).toMatchObject({
      'android.enableJetifier': true,
      'android.useAndroidX': true,
      'org.gradle.jvmargs': 'test'
    });
  });

  it('should apply several entries for the same file', async () => {
    const op: AndroidPropertiesOperation = {
      value: [
        {
          file: 'gradle.properties',
          entries: {
            keyOne: 'valueOne',
          },
        },
        {
          file: 'gradle.properties',
          entries: {
            keyTwo: 'valueTwo',
          },
        },
      ],
    };

    await Op(ctx, op as Operation);
    await ctx.project.commit();

    const contents = await readFile(join(dir, 'android/gradle.properties'), { encoding: 'utf-8' });
    expect(contents).toContain('keyOne=valueOne');
    expect(contents).toContain('keyTwo=valueTwo');
  });

  it('should write properties to disk on commit', async () => {
    const op: AndroidPropertiesOperation = {
      value: [
        {
          file: 'gradle.properties',
          entries: {
            'org.gradle.jvmargs': 'test',
          },
        },
      ],
    };

    await Op(ctx, op as Operation);
    await ctx.project.commit();

    const contents = await readFile(join(dir, 'android/gradle.properties'), { encoding: 'utf-8' });
    expect(contents).toContain('org.gradle.jvmargs=test');
  });

});
