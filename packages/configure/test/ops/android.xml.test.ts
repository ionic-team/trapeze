import { copy, readFile } from '@ionic/utils-fs';
import { join } from 'path';
import tempy from 'tempy';

import { Context, loadContext } from '../../src/ctx';
import { AndroidXmlOperation, Operation } from '../../src/definitions';
import Op from '../../src/operations/android/xml';
import { makeOp } from '../utils';

describe('op: android.xml', () => {
  let dir: string;
  let ctx: Context;

  beforeEach(async () => {
    dir = tempy.directory();

    await copy('../common/test/fixtures/ios-and-android', dir);

    ctx = await loadContext(dir);
    ctx.args.quiet = true;
  });

  it('should delete nodes', async () => {
    const op: AndroidXmlOperation = makeOp('android', 'xml', [
      {
        file: 'app/src/main/AndroidManifest.xml',
        delete: '//intent-filter'
      },
    ]);

    await Op(ctx, op as Operation);

    console.log(ctx.project.vfs.all());

    await ctx.project.commit();

    const file = await readFile(join(dir, 'android/app/src/main/AndroidManifest.xml'), { encoding: 'utf-8' });
    //console.log(file);
    expect(file.trim()).toBe(`
<?xml version="1.0" encoding="utf-8" ?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="io.ionic.starter">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <meta-data android:name="com.google.android.geo.API_KEY" android:value="\${MAPS_API_KEY}" />

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name="io.ionic.starter.MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
        />

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
    `.trim());
  });

});
