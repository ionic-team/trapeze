import { AndroidProject } from "./android/project";
import { IosProject } from "./ios/project";

import { CapacitorConfig } from '@capacitor/cli';

export class CapacitorProject {
  ios: IosProject | null;
  android: AndroidProject | null;

  constructor() {
  }

  /**
   * Load projects from Capacitor project root.
   */
  async load(config: CapacitorConfig) {
    console.log('Loading from config', config);
  }
}