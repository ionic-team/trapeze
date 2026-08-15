import { MobileProject, XmlFile } from '../src';

import { join } from 'path';
import { pathExists, readFile, stat } from '@ionic/utils-fs';
import { formatXml, serializeXml } from "../src/util/xml";
import { MobileProjectConfig } from '../src/config';
import { GradleFile } from '../src/android/gradle-file';
import { useFixture } from './utils';

describe('project - base', () => {
  let config: MobileProjectConfig;
  let project: MobileProject;
  let dir: string;
  beforeEach(async () => {
    dir = await useFixture('ios-and-android');

    config = {
      ios: {
        path: 'ios/App'
      },
      android: {
        path: 'android'
      }
    }

    project = new MobileProject(dir, config);
    await project.load();
  });

  it('Should copy files', async () => {
    await project.copyFile('capacitor.config.ts', 'capacitor.config.ts.copy');
    const src = join(dir, 'capacitor.config.ts');
    const srcContents = await readFile(src);
    const dest = join(dir, 'capacitor.config.ts.copy');
    const destContents = await readFile(dest);
    expect(srcContents).toEqual(destContents);
  });

  it('Should not modify the config it was given', async () => {
    const reusedConfig: MobileProjectConfig = {
      ios: { path: 'ios/App' },
      android: { path: 'android' },
    };

    const first = new MobileProject(dir, reusedConfig);
    const second = new MobileProject(dir, reusedConfig);
    await Promise.all([first.load(), second.load()]);

    expect(reusedConfig.ios?.path).toBe('ios/App');
    expect(reusedConfig.android?.path).toBe('android');
    expect(second.config.ios?.path).toBe(first.config.ios?.path);
    expect(second.ios).not.toBeNull();
    expect(second.android).not.toBeNull();
  });
});
