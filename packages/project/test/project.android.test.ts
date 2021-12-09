import tempy from 'tempy';

import { CapacitorConfig } from "@capacitor/cli";
import { CapacitorProject } from '../src';

import { join } from 'path';
import { copy, pathExists, readFile, rm } from '@ionic/utils-fs';
import { serializeXml } from "../src/util/xml";

describe('project - android', () => {
  let config: CapacitorConfig;
  let project: CapacitorProject;
  let dir: string;
  beforeEach(async () => {
    dir = tempy.directory();
    await copy('../common/test/fixtures/ios-and-android', dir);

    config = {
      ios: {
        path: join(dir, 'ios')
      },
      android: {
        path: join(dir, 'android')
      }
    }

    project = new CapacitorProject(config);
    await project.load();
  });

  afterEach(async () => {
    await rm(dir, { force: true, recursive: true });
  });

  it('should load project', async () => {
    expect(project.android?.getAndroidManifest()).not.toBe(null);
    expect(project.android?.getBuildGradle()).not.toBe(null);
    expect(project.android?.getAppBuildGradle()).not.toBe(null);
  });

  it('should set package name', async () => {
    await project.android?.setPackageName('com.ionicframework.awesome');
    expect(project.android?.getPackageName()).toBe('com.ionicframework.awesome');
    expect(await project.android?.getAppBuildGradle()?.getApplicationId()).toBe('com.ionicframework.awesome');
    const newSource = await readFile(join(project.config.android?.path!, 'app/src/main/java/com/ionicframework/awesome/MainActivity.java'), { encoding: 'utf-8' });
    expect(newSource.indexOf('package com.ionicframework.awesome;')).toBe(0);
    expect(!(await pathExists(join(project.config.android?.path!, 'app/src/main/java/io')))).toBe(true);
  });

  it('should set package name longer than current package', async () => {
    await project.android?.setPackageName('com.ionicframework.awesome.long');
    expect(project.android?.getPackageName()).toBe('com.ionicframework.awesome.long');
    expect(await project.android?.getAppBuildGradle()?.getApplicationId()).toBe('com.ionicframework.awesome.long');
    const newSource = await readFile(join(project.config.android?.path!, 'app/src/main/java/com/ionicframework/awesome/long/MainActivity.java'), { encoding: 'utf-8' });
    expect(newSource.indexOf('package com.ionicframework.awesome.long;')).toBe(0);
    expect(!(await pathExists(join(project.config.android?.path!, 'app/src/main/java/io')))).toBe(true);
  });

  it('should set package name shorter than current package', async () => {
    await project.android?.setPackageName('com.super');
    expect(project.android?.getPackageName()).toBe('com.super');
    expect(await project.android?.getAppBuildGradle()?.getApplicationId()).toBe('com.super');
    const newSource = await readFile(join(project.config.android?.path!, 'app/src/main/java/com/super/MainActivity.java'), { encoding: 'utf-8' });
    expect(newSource.indexOf('package com.super;')).toBe(0);
    expect(!(await pathExists(join(project.config.android?.path!, 'app/src/main/java/io')))).toBe(true);
  });

  it('should add an attribute on a manifest node', async () => {
    project.android?.getAndroidManifest().setAttrs('manifest/application', {
      'android:name': 'com.ionicframework.test.CoolApplication'
    });

    const applicationNode = project.android?.getAndroidManifest().find('manifest/application')?.[0];
    expect(applicationNode.getAttribute('android:name')).toBe('com.ionicframework.test.CoolApplication');

    project.android?.getAndroidManifest().setAttrs("/manifest/application/meta-data[@*='com.google.android.geo.API_KEY']",
      {
        'android:value': '---API-KEY---',
      }
    );

    const metadataNode = project.android?.getAndroidManifest().find("/manifest/application/meta-data[@*='com.google.android.geo.API_KEY']")?.[0];
    expect(metadataNode.getAttribute('android:value')).toBe('---API-KEY---');

    const manifestFile = project.vfs.get((project.android as any).getAndroidManifestPath());
    expect(manifestFile).not.toBeNull();

    // Make sure the updated file hasn't been destroyed
    expect(serializeXml(manifestFile?.getData())).toContain('<manifest');
  });

  it('should inject an XML fragment', async () => {
    project.android?.getAndroidManifest().injectFragment('manifest', `
    <queries>
      <package />
      <intent>
      </intent>
    </queries>
    `);

    const queriesNode = project.android?.getAndroidManifest().find('manifest/queries')?.[0];
    expect(queriesNode).toBeDefined();
    expect(queriesNode.nodeName).toBe('queries');
    const intentNode = project.android?.getAndroidManifest().find('manifest/queries/intent')?.[0];
    expect(intentNode).toBeDefined();
    expect(intentNode.nodeName).toBe('intent');

    const manifestFile = project.vfs.get((project.android as any).getAndroidManifestPath());
    expect(manifestFile).not.toBeNull();
  });

  it('should set version', async () => {
    await project.android?.setVersionName('5.0.2');
    expect(await project.android?.getVersionName()).toBe('5.0.2');

    await project.android?.setVersionCode(123);
    expect(await project.android?.getVersionCode()).toBe(123);
    expect(await project.android?.getVersionName()).toBe('5.0.2');

    await project.android?.incrementVersionCode();
    expect(await project.android?.getVersionCode()).toBe(124);
    expect(await project.android?.getVersionName()).toBe('5.0.2');

    const appBuildGradle = project.android?.getAppBuildGradle();
    expect(appBuildGradle).not.toBe(null);
    const appBuildGradleSource = project.vfs.get(appBuildGradle?.filename!);
    expect(appBuildGradleSource).not.toBe(null);
    expect(appBuildGradleSource!.getData()).toBe(`apply plugin: 'com.android.application'

android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    defaultConfig {
        applicationId "io.ionic.starter"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 124
        versionName "5.0.2"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
             // Files and dirs to omit from the packaged assets dir, modified to accommodate modern web apps.
             // Default: https://android.googlesource.com/platform/frameworks/base/+/282e181b58cf72b6ca770dc7ca5f91f135444502/tools/aapt/AaptAssets.cpp#61
            ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
        }
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

repositories {
    flatDir{
        dirs '../capacitor-cordova-android-plugins/src/main/libs', 'libs'
    }
}

dependencies {
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    implementation "androidx.appcompat:appcompat:$androidxAppCompatVersion"
    implementation project(':capacitor-android')
    testImplementation "junit:junit:$junitVersion"
    androidTestImplementation "androidx.test.ext:junit:$androidxJunitVersion"
    androidTestImplementation "androidx.test.espresso:espresso-core:$androidxEspressoCoreVersion"
    implementation project(':capacitor-cordova-android-plugins')
}

apply from: 'capacitor.build.gradle'

try {
    def servicesJSON = file('google-services.json')
    if (servicesJSON.text) {
        apply plugin: 'com.google.gms.google-services'
    }
} catch(Exception e) {
    logger.warn("google-services.json not found, google-services plugin not applied. Push Notifications won't work")
}
`);
  });

  it('should add resources file', async () => {
    await project.android?.addResource('raw', 'test.json', `{
      "thing": "cool"
    }`);

    const found = await project.android?.getResource('raw', 'test.json');
    expect(found).toEqual(`{
      "thing": "cool"
    }`);
  });

  it('should copy resources file', async () => {
    const src = join('../', 'common', 'test', 'fixtures', 'icon.png');
    const srcContents = await readFile(src);
    await project.android?.copyToResources('drawable', 'icon.png', src);
    const destContents = await project.android?.getResource('drawable', 'icon.png', null) as Buffer;

    expect(Buffer.compare(srcContents, destContents)).toBe(0);
  });
});