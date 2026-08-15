import { rm, writeFile } from '@ionic/utils-fs';
import { join } from 'path';
import { temporaryDirectory } from 'tempy';

import { Framework } from '../../src/frameworks';
import { CapacitorFramework } from '../../src/frameworks/capacitor';
import { CordovaFramework } from '../../src/frameworks/cordova';
import { DotNetMauiFramework } from '../../src/frameworks/dotnet-maui';
import { FlutterFramework } from '../../src/frameworks/flutter';
import { NativeAndroidFramework } from '../../src/frameworks/native-android';
import { NativeIosFramework } from '../../src/frameworks/native-ios';
import { NativeScriptFramework } from '../../src/frameworks/nativescript';
import { ReactNativeFramework } from '../../src/frameworks/react-native';
import { MobileProject } from '../../src/project';

async function loadProject(projectRoot: string) {
  const project = new MobileProject(projectRoot);
  await project.load();
  return project;
}

describe('frameworks: detection', () => {
  const fixtures: [string, typeof Framework][] = [
    ['frameworks/flutter_configure_test', FlutterFramework],
    ['frameworks/ReactNativeProject', ReactNativeFramework],
    ['frameworks/ReactNativeExpo', ReactNativeFramework],
    ['ios-and-android', CapacitorFramework],
    ['frameworks/CordovaApp', CordovaFramework],
    ['frameworks/DotNetMauiApp', DotNetMauiFramework],
    ['frameworks/NativeScriptApp', NativeScriptFramework],
    ['frameworks/NativeIosApp', NativeIosFramework],
    ['frameworks/NativeAndroidApp', NativeAndroidFramework],
  ];

  it.each(fixtures)('should detect the framework of %s', async (fixture, framework) => {
    const project = await loadProject(`../common/test/fixtures/${fixture}`);

    expect(project.framework).toBeInstanceOf(framework);
  });

  it('should not detect a framework whose marker files are missing', async () => {
    const project = new MobileProject('../common/test/fixtures/ios-and-android');

    expect(await FlutterFramework.getFramework(project)).toBeNull();
    expect(await ReactNativeFramework.getFramework(project)).toBeNull();
    expect(await CordovaFramework.getFramework(project)).toBeNull();
    expect(await DotNetMauiFramework.getFramework(project)).toBeNull();
    expect(await NativeScriptFramework.getFramework(project)).toBeNull();
    expect(await NativeIosFramework.getFramework(project)).toBeNull();
    expect(await NativeAndroidFramework.getFramework(project)).toBeNull();
  });

  it('should detect no framework at all for a project without markers', async () => {
    const dir = temporaryDirectory();

    const project = await loadProject(dir);
    expect(project.framework).toBeNull();

    await rm(dir, { force: true, recursive: true });
  });

  // The detection order in MobileProject.detectFramework decides which framework wins when
  // several match: the cross-platform frameworks come first, the native ones last
  describe('detection order', () => {
    let dir: string;

    beforeEach(() => {
      dir = temporaryDirectory();
    });

    afterEach(async () => {
      await rm(dir, { force: true, recursive: true });
    });

    it('should prefer Flutter over Capacitor', async () => {
      await writeFile(join(dir, 'pubspec.yaml'), 'name: app\n');
      await writeFile(join(dir, 'capacitor.config.json'), '{}');

      expect((await loadProject(dir)).framework).toBeInstanceOf(FlutterFramework);
    });

    it('should prefer Capacitor over Cordova', async () => {
      await writeFile(join(dir, 'capacitor.config.json'), '{}');
      await writeFile(join(dir, 'config.xml'), '<widget />');

      expect((await loadProject(dir)).framework).toBeInstanceOf(CapacitorFramework);
    });

    it('should prefer Capacitor over the native frameworks', async () => {
      await writeFile(join(dir, 'capacitor.config.json'), '{}');
      await writeFile(join(dir, 'build.gradle'), '');

      expect((await loadProject(dir)).framework).toBeInstanceOf(CapacitorFramework);
    });
  });
});
