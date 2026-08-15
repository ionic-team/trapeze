import { copy, pathExists, readFile, rm, writeFile } from '@ionic/utils-fs';
import { stat } from 'fs/promises';
import { inspect } from 'util';
import { temporaryDirectory } from 'tempy';
import { join } from 'path';
import plist from 'plist';

import { loadContext } from '../../src/ctx';
import { runCommand } from '../../src/tasks/run';
import { logger } from '../../src/util/log';
import { logPrompt } from '../../src/util/cli';
import { loadYamlConfig } from '../../src/yaml-config';

vi.mock('../../src/util/cli', async importOriginal => ({
  ...(await importOriginal<typeof import('../../src/util/cli')>()),
  logPrompt: vi.fn(),
}));

async function captureLoggedLines(run: () => Promise<void>): Promise<string[]> {
  const lines: string[] = [];
  const spy = vi.spyOn(console, 'log').mockImplementation((...args: any[]) => {
    const formatted = args
      .map(arg => (typeof arg === 'string' ? arg : inspect(arg)))
      .join(' ');
    lines.push(formatted.replace(/\x1b\[[0-9;]*m/g, ''));
  });

  try {
    await run();
  } finally {
    spy.mockRestore();
  }

  return lines;
}

describe('task: run', () => {
  it('should process variables operations', async () => {
    const dir = temporaryDirectory();
    await copy('../common/test/fixtures/basic.yml', join(dir, 'basic.yml'));

    const ctx = await loadContext(dir);

    await loadYamlConfig(ctx, join(dir, 'basic.yml'));

    expect(ctx.vars).toMatchObject({
      NUMBER: {
        default: 0,
        value: 0
      },
      BUNDLE_ID: {
        default: 'io.ionic.fixtureTest',
        value: 'io.ionic.fixtureTest',
      },
      PACKAGE_NAME: {
        default: 'io.ionic.fixtureTest',
        value: 'io.ionic.fixtureTest',
      },
      KEYCHAIN_GROUPS: {
        default: [
          '$BUNDLE_ID',
          'com.microsoft.intune.mam',
          'com.microsoft.adalcache',
        ],
        value: [
          '$BUNDLE_ID',
          'com.microsoft.intune.mam',
          'com.microsoft.adalcache',
        ]
      }
    });
  });

  it('should handle JSON-values in variables', async () => {
    const dir = temporaryDirectory();
    await copy('../common/test/fixtures/basic.yml', join(dir, 'basic.yml'));

    const ctx = await loadContext(dir);

    await loadYamlConfig(ctx, join(dir, 'basic.yml'));
  });

  it('should run operations', { timeout: 120000 }, async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);
    await copy('../common/test/fixtures/basic.yml', join(dir, 'basic.yml'));

    const ctx = await loadContext(dir);

    ctx.args.y = true;
    ctx.args.quiet = true;
    ctx.args.commit = false;

    await runCommand(ctx, '../common/test/fixtures/basic.yml');

    const files = ctx.project.vfs.all();

    expect(files).toEqual({
      [join(dir, 'android/build.gradle')]: expect.anything(),
      [join(dir, 'android/app/build.gradle')]: expect.anything(),
      [join(dir, 'android/google-services.json')]: expect.anything(),
      [join(dir, 'android/app/src/main/AndroidManifest.xml')]: expect.anything(),
      [join(dir, 'android/app/src/main/res/values/strings.xml')]: expect.anything(),
      [join(dir, 'ios/App/App.xcodeproj/project.pbxproj')]: expect.anything(),
      [join(dir, 'ios/App/App/App.entitlements')]: expect.anything(),
      [join(dir, 'ios/App/App/Info.plist')]: expect.anything(),
      [join(dir, 'ios/App/My App Clip/AppClip.plist')]: expect.anything(),
      [join(
        dir,
        'ios/App/My App Clip/My_App_Clip.entitlements',
      )]: expect.anything(),
    });

    await rm(dir, { force: true, recursive: true });
  });

  it('Should support providing the project root as an arg', async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/custom-platform-directories', dir);

    process.argv.push('--project-root');
    process.argv.push(dir);
    process.argv.push('-y');
    process.argv.push('--quiet');
    process.argv.push('--no-commit');
    const ctx = await loadContext(undefined, 'my-android-app', 'my-ios-app/App');
    ctx.args.quiet = true;

    expect(ctx.args.projectRoot).toBe(dir);

    await runCommand(ctx, '../common/test/fixtures/basic.yml');

    const files = ctx.project.vfs.all();

    expect(files).toEqual({
      [join(dir, 'my-android-app/build.gradle')]: expect.anything(),
      [join(dir, 'my-android-app/google-services.json')]: expect.anything(),
      [join(dir, 'my-android-app/app/build.gradle')]: expect.anything(),
      [join(dir, 'my-android-app/app/src/main/AndroidManifest.xml')]: expect.anything(),
      [join(dir, 'my-android-app/app/src/main/res/values/strings.xml')]: expect.anything(),
      [join(dir, 'my-ios-app/App/App.xcodeproj/project.pbxproj')]: expect.anything(),
      [join(dir, 'my-ios-app/App/App/App.entitlements')]: expect.anything(),
      [join(dir, 'my-ios-app/App/App/Info.plist')]: expect.anything(),
      [join(
        dir,
        'my-ios-app/App/My App Clip/AppClip.plist',
      )]: expect.anything(),
      [join(
        dir,
        'my-ios-app/App/My App Clip/My_App_Clip.entitlements',
      )]: expect.anything(),
    });
  });

  it('should commit operations to filesystem', async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);
    await copy('../common/test/fixtures/basic.yml', join(dir, 'basic.yml'));

    const ctx = await loadContext(dir);
    ctx.args.y = true;
    ctx.args.quiet = true;
    ctx.args.commit = false;

    await runCommand(ctx, join(dir, 'basic.yml'));

    const files = ctx.project.vfs.all();
    expect(files).toEqual({
      [join(dir, 'android/build.gradle')]: expect.anything(),
      [join(dir, 'android/google-services.json')]: expect.anything(),
      [join(dir, 'android/app/build.gradle')]: expect.anything(),
      [join(
        dir,
        'android/app/src/main/AndroidManifest.xml',
      )]: expect.anything(),
      [join(
        dir,
        'android/app/src/main/res/values/strings.xml',
      )]: expect.anything(),
      [join(dir, 'ios/App/App.xcodeproj/project.pbxproj')]: expect.anything(),
      [join(dir, 'ios/App/App/App.entitlements')]: expect.anything(),
      [join(dir, 'ios/App/App/Info.plist')]: expect.anything(),
      [join(dir, 'ios/App/My App Clip/AppClip.plist')]: expect.anything(),
      [join(
        dir,
        'ios/App/My App Clip/My_App_Clip.entitlements',
      )]: expect.anything(),
    });

    await ctx.project.commit();

    const buildGradleContents = await readFile(
      join(dir, 'android/build.gradle'),
      { encoding: 'utf-8' },
    );

    expect(buildGradleContents).toContain('org.javassist');
    expect(buildGradleContents).toContain(
      'files("../node_modules/@ionic-enterprise/intune',
    );
    expect(buildGradleContents).toContain('DuoSDK-Public');

    const appGradleContents = await readFile(
      join(dir, 'android/app/build.gradle'),
      { encoding: 'utf-8' },
    );
    expect(appGradleContents).toContain(
      "apply plugin: 'com.microsoft.intune.mam'",
    );
    expect(appGradleContents).toContain('intunemam {');
    expect(appGradleContents).toContain('versionCode 197');
    expect(appGradleContents).toContain('versionName "5.2.1"');

    const pbxProj = await readFile(
      join(dir, 'ios/App/App.xcodeproj/project.pbxproj'),
      { encoding: 'utf-8' },
    );
    expect(pbxProj).toContain(
      'PRODUCT_BUNDLE_IDENTIFIER = io.ionic.fixtureTest',
    );

    const entitlements = await readFile(
      join(dir, 'ios/App/App/App.entitlements'),
      { encoding: 'utf-8' },
    );
    expect(entitlements).toContain('keychain-access-groups');

    const plist = await readFile(join(dir, 'ios/App/App/Info.plist'), {
      encoding: 'utf-8',
    });
    expect(plist).toContain('msauth.com.microsoft.intunemam');

    // Cleanup temp dir
    await rm(dir, { force: true, recursive: true });
  });

  // TODO: Separate this out into multiple sub-tests
  it('should commit operations to filesystem directly with y', async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);
    await copy('../common/test/fixtures/basic.yml', join(dir, 'basic.yml'));

    const ctx = await loadContext(dir);
    ctx.args.y = true;
    ctx.args.quiet = true;
    ctx.args.commit = true;

    await runCommand(ctx, join(dir, 'basic.yml'));

    const files = ctx.project.vfs.all();
    expect(files).toEqual({
      [join(dir, 'android/build.gradle')]: expect.anything(),
      [join(dir, 'android/app/build.gradle')]: expect.anything(),
      [join(dir, 'android/google-services.json')]: expect.anything(),
      [join(
        dir,
        'android/app/src/main/AndroidManifest.xml',
      )]: expect.anything(),
      [join(
        dir,
        'android/app/src/main/res/values/strings.xml',
      )]: expect.anything(),
      [join(dir, 'ios/App/App.xcodeproj/project.pbxproj')]: expect.anything(),
      [join(dir, 'ios/App/App/App.entitlements')]: expect.anything(),
      [join(dir, 'ios/App/App/Info.plist')]: expect.anything(),
      [join(dir, 'ios/App/My App Clip/AppClip.plist')]: expect.anything(),
      [join(
        dir,
        'ios/App/My App Clip/My_App_Clip.entitlements',
      )]: expect.anything(),
    });

    const buildGradleContents = await readFile(
      join(dir, 'android/build.gradle'),
      { encoding: 'utf-8' },
    );

    expect(buildGradleContents).toContain('org.javassist');
    expect(buildGradleContents).toContain(
      'files("../node_modules/@ionic-enterprise/intune',
    );
    expect(buildGradleContents).toContain('DuoSDK-Public');

    const appGradleContents = await readFile(
      join(dir, 'android/app/build.gradle'),
      { encoding: 'utf-8' },
    );
    expect(appGradleContents).toContain(
      "apply plugin: 'com.microsoft.intune.mam'",
    );
    expect(appGradleContents).toContain('intunemam {');
    expect(appGradleContents).toContain('versionCode 197');
    expect(appGradleContents).toContain('versionName "5.2.1"');
    // This was a replace rather than an insert
    expect(appGradleContents).toContain('minifyEnabled true');
    expect(appGradleContents).toContain("implementation 'test-implementation'");

    const jsonContents = await readFile(
      join(dir, 'android/google-services.json'),
      { encoding: 'utf-8' },
    );

    const pbxProj = await readFile(
      join(dir, 'ios/App/App.xcodeproj/project.pbxproj'),
      { encoding: 'utf-8' },
    );
    expect(pbxProj).toContain(
      'PRODUCT_BUNDLE_IDENTIFIER = io.ionic.fixtureTest',
    );
    expect(pbxProj).toContain('CURRENT_PROJECT_VERSION = 195');

    const entitlements = await ctx.project.ios?.getEntitlements('App');
    expect(entitlements).toMatchObject({
      'keychain-access-groups': [
        'io.ionic.fixtureTest',
        'com.microsoft.intune.mam',
        'com.microsoft.adalcache',
      ],
    });

    const appClipEntitlements = await ctx.project.ios?.getEntitlements(
      'My App Clip',
    );
    expect(appClipEntitlements).toMatchObject({
      'keychain-access-groups': ['app-clip-group'],
    });

    const plistContents = await readFile(join(dir, 'ios/App/App/Info.plist'), {
      encoding: 'utf-8',
    });
    const plistParsed = plist.parse(plistContents) as any;
    expect(plistParsed['UISupportedInterfaceOrientations']).toEqual([
      'UIInterfaceOrientationPortrait',
    ]);
    expect(plistParsed['NSFaceIDUsageDescription']).toBe(
      'Use Face ID to authenticate yourself and login',
    );
    expect(plistContents).toContain('msauth.com.microsoft.intunemam');

    // Cleanup temp dir
    await rm(dir, { force: true, recursive: true });
  });

  it('should report project operations as run and not as skipped', async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/project-only', dir);

    const ctx = await loadContext(dir);
    ctx.args.commit = false;
    ctx.args.quiet = false;

    const lines = await captureLoggedLines(() =>
      runCommand(ctx, '../common/test/fixtures/project.basic.yml'),
    );

    expect(lines).toContainEqual(expect.stringMatching(/^run project json/));
    expect(lines).toContainEqual(expect.stringMatching(/^run project xml/));
    expect(lines.some(line => line.startsWith('skip'))).toBe(false);
    expect(lines.some(line => line.startsWith('updated'))).toBe(true);

    await rm(dir, { force: true, recursive: true });
  });

  it('should not report operations or updated files when quiet', async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/project-only', dir);

    const ctx = await loadContext(dir);
    ctx.args.commit = false;
    ctx.args.quiet = true;

    const lines = await captureLoggedLines(() =>
      runCommand(ctx, '../common/test/fixtures/project.basic.yml'),
    );

    expect(lines.some(line => line.startsWith('run'))).toBe(false);
    expect(lines.some(line => line.startsWith('updated'))).toBe(false);

    await rm(dir, { force: true, recursive: true });
  });

  it('should report why a native project failed to load', async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);
    await writeFile(
      join(dir, 'ios/App/App.xcodeproj/project.pbxproj'),
      '// !$*UTF8*$!\n{ this is not a pbxproj }\n',
    );

    const ctx = await loadContext(dir);
    ctx.args.commit = false;
    ctx.args.quiet = true;

    const errors: string[] = [];
    const spy = vi
      .spyOn(logger, 'error')
      .mockImplementation((msg: any) => errors.push(String(msg)));

    try {
      await runCommand(ctx, '../common/test/fixtures/project.basic.yml');
    } finally {
      spy.mockRestore();
    }

    expect(errors).toContainEqual(
      expect.stringContaining('Unable to load the iOS project'),
    );

    await rm(dir, { force: true, recursive: true });
  });

  it('should leave files alone that no operation modified', { timeout: 120000 }, async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);
    await copy('../common/test/fixtures/project.basic.yml', join(dir, 'project.basic.yml'));

    const manifest = join(dir, 'android/app/src/main/AndroidManifest.xml');
    const pbxProj = join(dir, 'ios/App/App.xcodeproj/project.pbxproj');
    const before = await readUntouched([manifest, pbxProj]);

    const ctx = await loadContext(dir);
    ctx.args.y = true;
    ctx.args.quiet = true;
    // An earlier test leaves --no-commit on process.argv; this test needs the commit
    ctx.args.commit = true;

    await runCommand(ctx, join(dir, 'project.basic.yml'));

    // The platform files are opened on load but no operation touched them, so
    // they must be neither rewritten nor re-touched
    expect(await readUntouched([manifest, pbxProj])).toEqual(before);

    expect(ctx.project.vfs.modifiedFiles().map(f => f.getFilename()).sort()).toEqual([
      join(dir, 'project-json.json'),
      join(dir, 'project-xml-strings.xml'),
    ]);

    const json = await readFile(join(dir, 'project-json.json'), { encoding: 'utf-8' });
    expect(json).toContain('asdf');

    await rm(dir, { force: true, recursive: true });
  });

  it('should print a diff for every kind of modified file', async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/ios-and-android', dir);
    await copy('../common/test/fixtures/diff.yml', join(dir, 'diff.yml'));

    const ctx = await loadContext(dir);
    ctx.args.diff = true;
    ctx.args.dryRun = true;
    ctx.args.quiet = false;

    const lines = await captureLoggedLines(() => runCommand(ctx, join(dir, 'diff.yml')));
    const output = lines.join('\n');

    // gradle.properties and the pbxproj had no diff function at all, so --diff listed
    // them as updated and then printed nothing for them
    expect(output).toContain('org.gradle.jvmargs=-Xmx4096m');
    expect(output).toContain('PRODUCT_BUNDLE_IDENTIFIER = io.ionic.diffTest');

    // Diffing a file the run is about to create used to throw ENOENT and abort the run
    expect(output).toContain('"hello": "world"');

    // --dry-run writes nothing
    expect(await pathExists(join(dir, 'android/app/diff-new-file.json'))).toBe(false);

    await rm(dir, { force: true, recursive: true });
  });

  it('should not ask to apply changes when nothing was modified', async () => {
    const dir = temporaryDirectory();

    await copy('../common/test/fixtures/android-only', dir);
    await copy('../common/test/fixtures/ios.notargets.nobuilds.yml', join(dir, 'ios.yml'));

    const ctx = await loadContext(dir);
    ctx.args.y = false;
    ctx.args.quiet = true;
    ctx.args.noCommit = false;

    vi.mocked(logPrompt).mockClear();

    // Every operation targets iOS, which this project does not have
    await runCommand(ctx, join(dir, 'ios.yml'));

    expect(ctx.project.vfs.modifiedFiles()).toEqual([]);
    expect(logPrompt).not.toHaveBeenCalled();

    await rm(dir, { force: true, recursive: true });
  });
});

async function readUntouched(files: string[]) {
  return Promise.all(
    files.map(async file => ({
      contents: await readFile(file, { encoding: 'utf-8' }),
      modifiedAt: (await stat(file)).mtimeMs,
    })),
  );
}
