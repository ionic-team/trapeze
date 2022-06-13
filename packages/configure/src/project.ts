import { join } from 'path';
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';

import { loadExtConfig } from './app-config';

export async function loadProject(
  projectRootPath?: string,
): Promise<MobileProject> {
  const config = (await loadConfig(projectRootPath)) as MobileProjectConfig;
  const project = new MobileProject(projectRootPath ?? '', config);
  await project.load();
  return project;
}

async function loadConfig(
  projectRootPath?: string,
): Promise<MobileProjectConfig> {
  let extConfig: MobileProjectConfig | null = null;

  try {
    extConfig = await loadExtConfig(projectRootPath ?? '');
    if (!extConfig?.android?.path) {
      extConfig = {
        ...extConfig,
        android: {
          path: 'android',
        },
      };
    }

    if (!extConfig?.ios?.path) {
      extConfig = {
        ...extConfig,
        ios: {
          path: 'ios/App',
        },
      };
    }
  } catch (e) {
    console.warn('Unable to load external Capacitor config', e);
  }

  return (
    extConfig || {
      ios: {
        path: 'ios/App',
      },
      android: {
        path: 'android',
      },
    }
  );
}
