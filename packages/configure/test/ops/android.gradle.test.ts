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

    const file = ctx.project.vfs.get<GradleFile>(join(dir, 'android/app/build.gradle'));
    expect(file?.getData()?.getDocument()?.trim()).toEqual(`
apply plugin: 'com.android.application'

android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    defaultConfig {
        applicationId "io.ionic.starter"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 56
        versionName "1.2.3"
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
        implementation 'test-implementation'
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
}`.trim()
    );
  });

  it('Should non-exact insert', async () => {
    const op: AndroidGradleOperation = makeOp('gradle', [
      {
        file: 'build.gradle',
        target: {
          dependencies: {}
        },
        insert: [{
          implementation: "'test-implementation'"
        }]
      },
    ]);

    await Op(ctx, op as Operation);

    const file = ctx.project.vfs.get<GradleFile>(join(dir, 'android/build.gradle'));
    expect(file?.getData()?.getDocument()?.trim()).toEqual(`
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:4.2.1'
        classpath 'com.google.gms:google-services:4.3.5'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
        implementation 'test-implementation'
    }
}

apply from: "variables.gradle"

allprojects {
    repositories {
        google()
        jcenter()
    }
}

dependencies {
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`.trim()
    );
  });

  it('Should exact insert', async () => {
    const op: AndroidGradleOperation = makeOp('gradle', [
      {
        file: 'build.gradle',
        target: {
          dependencies: {}
        },
        insert: [{
          implementation: "'test-implementation'"
        }],
        exact: true
      },
    ]);

    await Op(ctx, op as Operation);

    const file = ctx.project.vfs.get<GradleFile>(join(dir, 'android/build.gradle'));
    expect(file?.getData()?.getDocument()?.trim()).toEqual(`
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:4.2.1'
        classpath 'com.google.gms:google-services:4.3.5'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

apply from: "variables.gradle"

allprojects {
    repositories {
        google()
        jcenter()
    }
}

dependencies {
    implementation 'test-implementation'
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`.trim()
    );
  });
});