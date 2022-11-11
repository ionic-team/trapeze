import { AndroidGradleInjectType, MobileProject } from '../src';
import { MobileProjectConfig } from '../src/config';
import { GradleFile } from '../src/android/gradle-file';

import { join } from 'path';
import { VFS } from '../src/vfs';

describe('project - android - gradle', () => {
  let config: MobileProjectConfig;
  let project: MobileProject;
  let vfs: VFS;
  beforeEach(async () => {
    config = {
      ios: {
        path: 'ios/App',
      },
      android: {
        path: 'android',
      },
    };

    project = new MobileProject(
      '../common/test/fixtures/ios-and-android',
      config,
    );
    await project.load();
    vfs = new VFS();
  });

  it('Should find path to gradle parse', async () => {
    const gradle = new GradleFile(
      join(project.config.android!.path!, 'build.gradle'),
      vfs,
    );
    expect(gradle.getGradleParserPath()).not.toBeUndefined();

    const output = await gradle.parse();
    expect(output).not.toBeNull();
  });

  it('Should find target element in parsed Gradle', async () => {
    const gradle = new GradleFile(
      join(project.config.android!.path!, 'build.gradle'),
      vfs,
    );
    await gradle.parse();

    let nodes = gradle.find({
      buildscript: {
        dependencies: {},
      },
    });

    expect(nodes.length).not.toBe(0);
    expect(nodes[0].node.type).toBe('method');
    expect(nodes[0].node.name).toBe('dependencies');

    // Should find the root node
    nodes = gradle.find({});

    expect(nodes.length).not.toBe(0);
  });

  it('Should find exact element in parsed Gradle', async () => {
    const gradle = new GradleFile(join(project.config.android!.path!, 'build.gradle'), vfs);
    await gradle.parse();

    let nodes = gradle.find({
      buildscript: {
        repositories: {}
      }
    }, true);

    expect(nodes.length).toBe(1);
    expect(nodes[0].node.type).toBe('method');
    expect(nodes[0].node.name).toBe('repositories');

    // Should find the root node
    nodes = gradle.find({
      dependencies: {}
    }, true);

    expect(nodes.length).toBe(1);
    expect(nodes[0].depth).toBe(1);

    // Old non-exact mode still works
    nodes = gradle.find({
      dependencies: {}
    });

    expect(nodes.length).toBe(2);
    expect(nodes[0].depth).toBe(2);
    expect(nodes[1].depth).toBe(1);
  });

  it('Should replace at spot', async () => {
    const gradle = new GradleFile(
      join('../common/test/fixtures/replace.gradle'),
      vfs,
    );

    await gradle.replaceProperties(
      {
        buildscript: {
          thing: {
            field: {},
          },
        },
      },
      { field: 4 },
    );

    await gradle.replaceProperties(
      {
        extra: {
          what: {},
        },
      },
      { what: "'this'" },
    );

    const source = vfs
      .get<GradleFile>(gradle.filename)
      ?.getData()
      ?.getDocument();
    expect(source?.trim()).toBe(
      `
dependencies {}

buildscript {
    thing {
        field 4
    }
    dependencies {
        implementation 'fake thing'
    }
}

extra {
    what 'this'
}

allprojects {
    nest1 {
        nest2 {
            dependencies {}
        }
    }
}
`.trim(),
    );
  });

  it('Should inject during replace if target does not exist', async () => {
    const gradle = new GradleFile(
      join('../common/test/fixtures/replace.gradle'),
      vfs,
    );

    await gradle.replaceProperties(
      {
        allprojects: {
          nest1: {
            nest2: {
              dependencies: {
                implementation: {},
              },
            },
          },
        },
      },
      { implementation: "'com.ionicframework.test'" },
    );

    const source = vfs
      .get<GradleFile>(gradle.filename)
      ?.getData()
      ?.getDocument();
    expect(source?.trim()).toBe(
      `
dependencies {}

buildscript {
    thing {
        field 2
    }
    dependencies {
        implementation 'fake thing'
    }
}

extra {
    what {
        foo 10
    }
}

allprojects {
    nest1 {
        nest2 {
            dependencies {
                implementation 'com.ionicframework.test'
            }
        }
    }
}
`.trim(),
    );
  });

  it('Should inject at spot', async () => {
    const gradle = new GradleFile(
      join(project.config.android!.path!, 'app', 'build.gradle'),
      vfs,
    );

    await gradle.insertProperties(
      {
        dependencies: {},
      },
      [
        { implementation: "'com.super.cool'" },
        { implementation: "'com.super.amazing'" },
      ],
    );
  });

  it('Should inject at root', async () => {
    const gradle = new GradleFile(
      join(project.config.android!.path!, 'app', 'build.gradle'),
      vfs,
    );

    await gradle.insertProperties({}, [{ 'apply from:': "'my.cool.package'" }]);
  });

  it('Should inject nested Gradle statements', async () => {
    const gradle = new GradleFile(
      join(project.config.android!.path!, 'build.gradle'),
      vfs,
    );

    await gradle.insertProperties(
      {
        dependencies: {},
      },
      [{ classpath: "'com.super.cool'" }, { classpath: "'com.super.amazing'" }],
    );

    await gradle.insertProperties(
      {
        allprojects: {
          repositories: {},
        },
      },
      [
        {
          maven: [
            {
              url: "'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1'",
              name: "'Duo-SDK-Feed'",
            },
          ],
        },
      ],
    );

    const source = vfs
      .get<GradleFile>(gradle.filename)
      ?.getData()
      ?.getDocument();
    expect(source?.trim())
      .toBe(`// Top-level build file where you can add configuration options common to all sub-projects/modules.

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
        classpath 'com.super.cool'
        classpath 'com.super.amazing'
    }
}

apply from: "variables.gradle"

allprojects {
    repositories {
        google()
        jcenter()
        maven {
            url 'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1'
            name 'Duo-SDK-Feed'
        }
    }
}

dependencies {
}

task clean(type: Delete) {
    delete rootProject.buildDir
}`);
  });

  it('Should inject Gradle statements in empty method blocks', async () => {
    const gradle = new GradleFile(
      join('../common/test/fixtures/inject.gradle'),
      vfs,
    );

    await gradle.insertProperties(
      {
        dependencies: {},
      },
      [{ implementation: "'com.whatever.cool'" }],
    );

    await gradle.insertProperties(
      {
        buildscript: {
          dependencies: {},
        },
      },
      [{ classpath: "files('path/to/thing')" }],
    );

    await gradle.insertProperties(
      {
        allprojects: {
          nest1: {
            nest2: {
              dependencies: {},
            },
          },
        },
      },
      [{ thing: "'here'" }],
    );

    const source = vfs
      .get<GradleFile>(gradle.filename)
      ?.getData()
      ?.getDocument();
    expect(source?.trim()).toBe(
      `
dependencies {
    implementation 'com.whatever.cool'
}

buildscript {
    thing {
    }
    dependencies {
        implementation 'fake thing'
        classpath files('path/to/thing')
    }
}

allprojects {
    nest1 {
        nest2 {
            dependencies {
                thing 'here'
            }
        }
    }
}
`.trim(),
    );
  });

  it('Should update complex gradle types', async () => {
    const gradle = await project.android?.getGradleFile('variables.gradle');
    await gradle?.parse();

    let nodes = gradle?.find({
      ext: {},
    });

    expect(nodes?.length).not.toBe(0);

    await gradle?.replaceProperties(
      {
        ext: {
          minSdkVersion: {},
        },
      },
      { minSdkVersion: ['hello'] },
    );

    await gradle?.replaceProperties(
      {
        ext: {
          compileSdkVersion: {},
        },
      },
      { compileSdkVersion: '"value"' },
    );

    const source = project.vfs
      .get<GradleFile>(gradle!.filename)
      ?.getData()
      ?.getDocument();
    expect(source?.trim()).toBe(`ext {
    minSdkVersion = ["hello"]
    compileSdkVersion = "value"
    targetSdkVersion = 30
    androidxActivityVersion = '1.2.0'
    androidxAppCompatVersion = '1.2.0'
    androidxCoordinatorLayoutVersion = '1.1.0'
    androidxCoreVersion = '1.3.2'
    androidxFragmentVersion = '1.3.0'
    junitVersion = '4.13.1'
    androidxJunitVersion = '1.1.2'
    androidxEspressoCoreVersion = '3.3.0'
    cordovaAndroidVersion = '7.0.0'
}`);
  });

  it('Should insert properties with variable gradle types', async () => {
    const gradle = await project.android?.getGradleFile('variables.gradle');
    await gradle?.parse();

    await gradle?.insertProperties({
      ext: {}
    }, [
      { firebaseMessagingVersion: "'20.0.6'" }
    ], AndroidGradleInjectType.Variable);

    const source = project.vfs
      .get<GradleFile>(gradle!.filename)
      ?.getData()
      ?.getDocument();
    expect(source?.trim()).toBe(`ext {
    minSdkVersion = 21
    compileSdkVersion = 30
    targetSdkVersion = 30
    androidxActivityVersion = '1.2.0'
    androidxAppCompatVersion = '1.2.0'
    androidxCoordinatorLayoutVersion = '1.1.0'
    androidxCoreVersion = '1.3.2'
    androidxFragmentVersion = '1.3.0'
    junitVersion = '4.13.1'
    androidxJunitVersion = '1.1.2'
    androidxEspressoCoreVersion = '3.3.0'
    cordovaAndroidVersion = '7.0.0'
    firebaseMessagingVersion = '20.0.6'
}`);
  });

  it('Should inject Gradle raw source', async () => {
    const gradle = new GradleFile(
      join('../common/test/fixtures/inject.gradle'),
      vfs,
    );

    await gradle.insertFragment(
      {},
      `
apply plugin: 'com.microsoft.intune.mam'

intunemam {
    includeExternalLibraries = [
        "androidx.*",
        "com.getcapacitor.*"
    ]
}
    `,
    );
    const source = vfs
      .get<GradleFile>(gradle.filename)
      ?.getData()
      ?.getDocument();
    expect(source?.trim()).toBe(
      `
dependencies {}

buildscript {
    thing {
    }
    dependencies {
        implementation 'fake thing'
    }
}

allprojects {
    nest1 {
        nest2 {
            dependencies {}
        }
    }
}


apply plugin: 'com.microsoft.intune.mam'

intunemam {
    includeExternalLibraries = [
        "androidx.*",
        "com.getcapacitor.*"
    ]
}`.trim(),
    );
  });

  it('Should support any gradle file', async () => {
    const gradle = await project.android?.getGradleFile('variables.gradle');
    await gradle?.parse();

    let nodes = gradle?.find({
      ext: {},
    });

    expect(nodes?.length).not.toBe(0);

    await gradle?.replaceProperties(
      {
        ext: {
          minSdkVersion: {},
        },
      },
      { minSdkVersion: 42 },
    );

    const source = project.vfs
      .get<GradleFile>(gradle!.filename)
      ?.getData()
      ?.getDocument();
    expect(source?.trim()).toBe(`ext {
    minSdkVersion = 42
    compileSdkVersion = 30
    targetSdkVersion = 30
    androidxActivityVersion = '1.2.0'
    androidxAppCompatVersion = '1.2.0'
    androidxCoordinatorLayoutVersion = '1.1.0'
    androidxCoreVersion = '1.3.2'
    androidxFragmentVersion = '1.3.0'
    junitVersion = '4.13.1'
    androidxJunitVersion = '1.1.2'
    androidxEspressoCoreVersion = '3.3.0'
    cordovaAndroidVersion = '7.0.0'
}`);
  });
});
