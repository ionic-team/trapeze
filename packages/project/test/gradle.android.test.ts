import { CapacitorConfig } from "@capacitor/cli";
import { CapacitorProject } from '../src';
import { Gradle } from '../src/android/gradle';

import { join } from 'path';

describe('project - android - gradle', () => {
  let config: CapacitorConfig;
  let project: CapacitorProject;
  beforeEach(async () => {
    config = {
      ios: {
        path: '../common/test/fixtures/ios'
      },
      android: {
        path: '../common/test/fixtures/android'
      }
    }

    project = new CapacitorProject(config);
    await project.load();
  });

  it('Should find path to gradle parse', async () => {
    const gradle = new Gradle(join(project.config.android!.path!, 'build.gradle'));
    expect(gradle.getGradleParserPath()).not.toBeUndefined();

    const output = await gradle.parse();
    expect(output).not.toBeNull();
  });

  it('Should throw an exception if no JAVA_HOME set', async () => {
    process.env.JAVA_HOME = '';
    const gradle = new Gradle(join(project.config.android!.path!, 'build.gradle'));
    await expect(gradle.parse()).rejects.toThrow();
  });
});