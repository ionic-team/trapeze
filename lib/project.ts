import { AndroidProject } from "./android/project";
import { IosProject } from "./ios/project";

import { CapacitorConfig } from '@capacitor/cli';

export class CapacitorProject {
  ios: IosProject | null;
  android: AndroidProject | null;

  constructor(public config: CapacitorConfig) {
    this.ios = new IosProject(this);
    this.android = new AndroidProject(this);
  }

  async load(): Promise<void> { }
  async commit(): Promise<void> { }
}