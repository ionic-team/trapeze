import { CapacitorConfig } from '@capacitor/cli';
import { join } from 'path';
import { CapacitorProject } from '@capacitor/project';

import { loadExtConfig } from './capacitor';

export async function loadProject(projectRootPath?: string): Promise<CapacitorProject> {
  const config = await loadCapacitorConfig(projectRootPath);
  const project = new CapacitorProject(config);
  await project.load();
  return project;
}

async function loadCapacitorConfig(projectRootPath?: string): Promise<CapacitorConfig> {
  let extConfig: CapacitorConfig | null = null;

  try {
    extConfig = await loadExtConfig(projectRootPath ?? '');
    if (extConfig?.android?.path) {
      extConfig.android.path = join(projectRootPath ?? '', extConfig.android.path);
    }
    if (extConfig?.ios?.path) {
      extConfig.ios.path = join(projectRootPath ?? '', extConfig.ios.path);
    }
  } catch (e) {
    console.warn('Unable to load external Capacitor config', e);
  }

  return extConfig || {
    ios: {
      path: projectRootPath ? join(projectRootPath, 'ios') : 'ios'
    },
    android: {
      path: projectRootPath ? join(projectRootPath, 'android') : 'android'
    }
  }
}