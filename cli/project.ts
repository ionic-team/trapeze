import { CapacitorConfig } from '@capacitor/cli';

import { Context } from './ctx';

import { CapacitorProject } from '../lib/project';

export async function loadProject(rootDir: string): Promise<CapacitorProject> {
  const project = new CapacitorProject();

  const config = await loadCapacitorConfig();

  await project.load(config);

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