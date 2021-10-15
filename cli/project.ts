import { CapacitorConfig } from '@capacitor/cli';

import { CapacitorProject } from '../lib/project';

export async function loadProject(rootDir: string): Promise<CapacitorProject> {
  const config = await loadCapacitorConfig();
  const project = new CapacitorProject(config);

  return project;
}

async function loadCapacitorConfig(): Promise<CapacitorConfig> {
  return {
    ios: {
      path: 'ios'
    },
    android: {
      path: 'android'
    }
  }
}