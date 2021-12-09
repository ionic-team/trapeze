import { copy, readFile, rm } from '@ionic/utils-fs';
import tempy from 'tempy';
import { join } from 'path';
import plist from 'plist';

import { loadContext } from '../../src/ctx';
import { runCommand } from '../../src/tasks/run';

describe('task: run', () => {
  it('should run operations', async () => {
    const ctx = await loadContext('../common/test/fixtures/ios-and-android');
    ctx.args.y = true;
    ctx.args.quiet = true;
    ctx.args.noCommit = true;

    await runCommand(ctx, '../common/test/fixtures/basic.yml');

    const files = ctx.project.vfs.all();

    expect(files).toEqual({
      '../common/test/fixtures/ios-and-android/android/build.gradle': expect.anything(),
      '../common/test/fixtures/ios-and-android/android/app/build.gradle': expect.anything(),
      '../common/test/fixtures/ios-and-android/android/app/src/main/AndroidManifest.xml': expect.anything(),
      '../common/test/fixtures/ios-and-android/ios/App/App.xcodeproj/project.pbxproj': expect.anything(),
      '../common/test/fixtures/ios-and-android/ios/App/App/App.entitlements': expect.anything(),
      '../common/test/fixtures/ios-and-android/ios/App/App/Info.plist': expect.anything(),
      '../common/test/fixtures/ios-and-android/ios/App/My App Clip/AppClip.plist': expect.anything(),
    });
  });

  it('should commit operations to filesystem', async () => {
    const dir = tempy.directory();

    await copy('../common/test/fixtures/ios-and-android', dir);
    await copy('../common/test/fixtures/basic.yml', join(dir, 'basic.yml'));

    const ctx = await loadContext(dir);
    ctx.args.y = true;
    ctx.args.quiet = true;
    ctx.args.noCommit = true;

    await runCommand(ctx, join(dir, 'basic.yml'));

    const files = ctx.project.vfs.all();
    expect(files).toEqual({
      [join(dir, 'android/build.gradle')]: expect.anything(),
      [join(dir, 'android/app/build.gradle')]: expect.anything(),
      [join(dir, 'android/app/src/main/AndroidManifest.xml')]: expect.anything(),
      [join(dir, 'ios/App/App.xcodeproj/project.pbxproj')]: expect.anything(),
      [join(dir, 'ios/App/App/App.entitlements')]: expect.anything(),
      [join(dir, 'ios/App/App/Info.plist')]: expect.anything(),
      [join(dir, 'ios/App/My App Clip/AppClip.plist')]: expect.anything(),
    });

    await ctx.project.commit();

    const buildGradleContents = await readFile(join(dir, 'android/build.gradle'), { encoding: 'utf-8' });

    expect(buildGradleContents).toContain('org.javassist');
    expect(buildGradleContents).toContain('files("../node_modules/@ionic-enterprise/intune');
    expect(buildGradleContents).toContain('DuoSDK-Public');

    const appGradleContents = await readFile(join(dir, 'android/app/build.gradle'), { encoding: 'utf-8' });
    expect(appGradleContents).toContain('apply plugin: \'com.microsoft.intune.mam\'');
    expect(appGradleContents).toContain('intunemam {');
    expect(appGradleContents).toContain('versionCode 197');
    expect(appGradleContents).toContain('versionName "5.2.1"');

    const pbxProj = await readFile(join(dir, 'ios/App/App.xcodeproj/project.pbxproj'), { encoding: 'utf-8' });
    expect(pbxProj).toContain('PRODUCT_BUNDLE_IDENTIFIER = io.ionic.fixtureTest');

    const entitlements = await readFile(join(dir, 'ios/App/App/App.entitlements'), { encoding: 'utf-8' });
    expect(entitlements).toContain('keychain-access-groups');

    const plist = await readFile(join(dir, 'ios/App/App/Info.plist'), { encoding: 'utf-8' });
    expect(plist).toContain('msauth.com.microsoft.intunemam');

    // Cleanup temp dir
    await rm(dir, { force: true, recursive: true });
  });

  // TODO: Separate this out into multiple sub-tests
  it.only('should commit operations to filesystem directly with y', async () => {
    const dir = tempy.directory();

    await copy('../common/test/fixtures/ios-and-android', dir);
    await copy('../common/test/fixtures/basic.yml', join(dir, 'basic.yml'));

    const ctx = await loadContext(dir);
    ctx.args.y = true;
    ctx.args.quiet = true;

    await runCommand(ctx, join(dir, 'basic.yml'));

    const files = ctx.project.vfs.all();
    expect(files).toEqual({
      [join(dir, 'android/build.gradle')]: expect.anything(),
      [join(dir, 'android/app/build.gradle')]: expect.anything(),
      [join(dir, 'android/app/src/main/AndroidManifest.xml')]: expect.anything(),
      [join(dir, 'ios/App/App.xcodeproj/project.pbxproj')]: expect.anything(),
      [join(dir, 'ios/App/App/App.entitlements')]: expect.anything(),
      [join(dir, 'ios/App/App/Info.plist')]: expect.anything(),
      [join(dir, 'ios/App/My App Clip/AppClip.plist')]: expect.anything(),
      [join(dir, 'ios/App/My App Clip/My_App_Clip.entitlements')]: expect.anything(),
    });

    const buildGradleContents = await readFile(join(dir, 'android/build.gradle'), { encoding: 'utf-8' });

    expect(buildGradleContents).toContain('org.javassist');
    expect(buildGradleContents).toContain('files("../node_modules/@ionic-enterprise/intune');
    expect(buildGradleContents).toContain('DuoSDK-Public');

    const appGradleContents = await readFile(join(dir, 'android/app/build.gradle'), { encoding: 'utf-8' });
    expect(appGradleContents).toContain('apply plugin: \'com.microsoft.intune.mam\'');
    expect(appGradleContents).toContain('intunemam {');
    expect(appGradleContents).toContain('versionCode 197');
    expect(appGradleContents).toContain('versionName "5.2.1"');

    const pbxProj = await readFile(join(dir, 'ios/App/App.xcodeproj/project.pbxproj'), { encoding: 'utf-8' });
    expect(pbxProj).toContain('PRODUCT_BUNDLE_IDENTIFIER = io.ionic.fixtureTest');
    expect(pbxProj).toContain('CURRENT_PROJECT_VERSION = 195');

    const entitlements = await ctx.project.ios?.getEntitlements('App');
    expect(entitlements).toMatchObject({
      'keychain-access-groups': [
        'io.ionic.fixtureTest',
        'com.microsoft.intune.mam',
        'com.microsoft.adalcache',
      ]
    });

    const appClipEntitlements = await ctx.project.ios?.getEntitlements('My App Clip');
    expect(appClipEntitlements).toMatchObject({
      'keychain-access-groups': [
        'app-clip-group'
      ]
    });

    const plistContents = await readFile(join(dir, 'ios/App/App/Info.plist'), { encoding: 'utf-8' });
    const plistParsed = plist.parse(plistContents) as any;
    expect(plistParsed['UISupportedInterfaceOrientations']).toEqual([
      'UIInterfaceOrientationPortrait'
    ]);
    expect(plistParsed['NSFaceIDUsageDescription']).toBe('Use Face ID to authenticate yourself and login');
    expect(plistContents).toContain('msauth.com.microsoft.intunemam');

    // Cleanup temp dir
    await rm(dir, { force: true, recursive: true });
  });
});