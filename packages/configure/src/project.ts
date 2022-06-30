import { join } from 'path';
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';
import { Context } from './ctx';
import { pathExists } from '@ionic/utils-fs';
import { error } from './util/log';

export async function loadProject(
  projectRootPath?: string,
  androidProject?: string,
  iosProject?: string
): Promise<MobileProject> {

  if (androidProject && !(await pathExists(join(projectRootPath ?? '', androidProject)))) {
    throw new Error(`Unable to find Android project at ${join(projectRootPath ?? '', androidProject)}`);
  }

  if (iosProject && !(await pathExists(join(projectRootPath ?? '', iosProject)))) {
    throw new Error(`Unable to find iOS project at ${join(projectRootPath ?? '', iosProject)}`);
  }

  const config = (await loadConfig(projectRootPath, androidProject, iosProject)) as MobileProjectConfig;
  const project = new MobileProject(projectRootPath ?? '', config);

  try {
    await project.load();
  } catch (e) {
    error('Unable to load projects. Ensure Android and iOS paths are correct');
    throw e;
  }
  return project;
}

async function loadConfig(
  projectRootPath?: string,
  androidProject?: string,
  iosProject?: string
): Promise<MobileProjectConfig> {
  return <MobileProjectConfig>{
    android: {
      path: androidProject ?? 'android'
    },
    ios: {
      path: iosProject ?? 'ios/App'
    }
  }
}
