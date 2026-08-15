import { readFile } from '@ionic/utils-fs';
import { XmlFile } from '@trapezedev/project';
import { join } from 'path';

import { Context, loadContext } from '../../src/ctx';
import { AndroidAppNameOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/android/appName';

import { makeOp, useFixture } from '../utils';

describe('op: android.appName', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = await useFixture('ios-and-android');

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should update appName', async () => {
    const op: AndroidAppNameOperation = makeOp('android', 'appName', 'New App Name');

    await Op(ctx, op as Operation);

    await ctx.project.commit();

    const file = await readFile(join(dir, 'android/app/src/main/res/values/strings.xml'), { encoding: 'utf-8' });
    //console.log(file);
    expect(file.trim()).toBe(`
<?xml version='1.0' encoding='utf-8' ?>
<resources>
    <string name="app_name">New App Name</string>
    <string name="title_activity_main">capacitor-configure-test</string>
    <string name="package_name">io.ionic.starter</string>
    <string name="custom_url_scheme">io.ionic.starter</string>
</resources>
    `.trim());
  });
});
