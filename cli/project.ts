import { CapacitorConfig } from '@capacitor/cli';
import { join } from 'path';

import { CapacitorProject } from '../lib/project';

export async function loadProject(projectRootPath?: string): Promise<CapacitorProject> {
  const config = await loadCapacitorConfig(projectRootPath);
  const project = new CapacitorProject(config);
  await project.load();
  return project;
}

function loadCapacitorConfig(projectRootPath?: string): CapacitorConfig {
  return {
    ios: {
      path: projectRootPath ? join(projectRootPath, 'ios') : 'ios'
    },
    android: {
      path: projectRootPath ? join(projectRootPath, 'android') : 'android'
    }
  }
}