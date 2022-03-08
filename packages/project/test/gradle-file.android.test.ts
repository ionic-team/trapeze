import { CapacitorConfig } from "@capacitor/cli";
import { CapacitorProject } from '../src';
import { GradleFile } from '../src/android/gradle-file';

import { join } from 'path';
import { VFS } from "../src/vfs";

describe('project - android - gradle', () => {
  let config: CapacitorConfig;
  let project: CapacitorProject;
  let vfs: VFS;
  beforeEach(async () => {
    config = {
      ios: {
        path: '../common/test/fixtures/ios-and-android/ios'
      },
      android: {
        path: '../common/test/fixtures/ios-and-android/android'
      }
    }

    project = new CapacitorProject(config);
    await project.load();
    vfs = new VFS();
  });

  it('Should find path to gradle parse', async () => {
    const gradle = new GradleFile(join(project.config.android!.path!, 'build.gradle'), vfs);
    expect(gradle.getGradleParserPath()).not.toBeUndefined();

    const output = await gradle.parse();
    expect(output).not.toBeNull();
  });

  it.skip('Should throw an exception if no JAVA_HOME set', async () => {
    process.env.JAVA_HOME = '';
    const gradle = new GradleFile(join(project.config.android!.path!, 'build.gradle'), vfs);
    await expect(gradle.parse()).rejects.toThrow();
  });

  it('Should find target element in parsed Gradle', async () => {
    const gradle = new GradleFile(join(project.config.android!.path!, 'build.gradle'), vfs);
    await gradle.parse();

    let nodes = gradle.find({
      buildscript: {
        dependencies: {}
      }
    });

    expect(nodes.length).not.toBe(0);
    expect(nodes[0].node.type).toBe('method');
    expect(nodes[0].node.name).toBe('dependencies');

    // Should find the root node
    nodes = gradle.find({});

    expect(nodes.length).not.toBe(0);
  });

  it.only('Should replace at spot', async () => {
    const gradle = new GradleFile(join('../common/test/fixtures/replace.gradle'), vfs);

    /*
    await gradle.replaceProperties({
      buildscript: {
        dependencies: {
          implementation: {}
        }
      }
    }, { implementation: "'com.whatever.cool'" });
    */

    await gradle.replaceProperties({
      buildscript: {
        thing: {
          field: {}
        }
      }
    }, { field: 4 });

    const source = vfs.get(gradle.filename)?.getData();
    expect(source.trim()).toBe(`
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
  what {
    foo 10
  }
}

allprojects {
    nest1 {
        nest2 {
            dependencies {}
        }
    }
}
`.trim());
  });

  it('Should inject at spot', async () => {
    const gradle = new GradleFile(join(project.config.android!.path!, 'app', 'build.gradle'), vfs);

    await gradle.insertProperties({
      dependencies: {}
    }, [
      { implementation: "'com.super.cool'" },
      { implementation: "'com.super.amazing'" },
    ]);
  });

  it('Should inject at root', async () => {
    const gradle = new GradleFile(join(project.config.android!.path!, 'app', 'build.gradle'), vfs);

    await gradle.insertProperties({}, [
      { 'apply from:': "'my.cool.package'" }
    ]);
  });

  it('Should inject nested Gradle statements', async () => {
    const gradle = new GradleFile(join(project.config.android!.path!, 'build.gradle'), vfs);

    await gradle.insertProperties({
      dependencies: {}
    }, [
      { classpath: "'com.super.cool'" },
      { classpath: "'com.super.amazing'" },
    ]);

    await gradle.insertProperties({
      allprojects: {
        repositories: {}
      }
    }, [{
      maven: [{
        url: "'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1'",
        name: "'Duo-SDK-Feed'"
      }]
    }]);
  });

  it('Should inject Gradle statements in empty method blocks', async () => {
    const gradle = new GradleFile(join('../common/test/fixtures/inject.gradle'), vfs);

    await gradle.insertProperties({
      dependencies: {}
    }, [
      { implementation: "'com.whatever.cool'" }
    ]);

    await gradle.insertProperties({
      buildscript: {
        dependencies: {}
      }
    }, [
      { classpath: "files('path/to/thing')" }
    ]);

    await gradle.insertProperties({
      allprojects: {
        nest1: {
          nest2: {
            dependencies: {}
          }
        }
      }
    }, [
      { thing: "'here'" }
    ]);

    const source = vfs.get(gradle.filename)?.getData();
    expect(source.trim()).toBe(`
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
`.trim());
  });

  it('Should inject Gradle raw source', async () => {
    const gradle = new GradleFile(join('../common/test/fixtures/inject.gradle'), vfs);

    await gradle.insertFragment({}, `
apply plugin: 'com.microsoft.intune.mam'

intunemam {
    includeExternalLibraries = [
        "androidx.*",
        "com.getcapacitor.*"
    ]
}
    `);
    const source = vfs.get(gradle.filename)?.getData();
    expect(source.trim()).toBe(`
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
}`.trim());
  });
});