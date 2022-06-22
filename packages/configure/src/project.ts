import { join } from 'path';
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';
import { Context } from './ctx';

export async function loadProject(
  projectRootPath?: string,
  androidProject?: string,
  iosProject?: string
): Promise<MobileProject> {
  const config = (await loadConfig(projectRootPath, androidProject, iosProject)) as MobileProjectConfig;
  const project = new MobileProject(projectRootPath ?? '', config);
  await project.load();
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
