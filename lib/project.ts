import { AndroidProject } from "./android/project";
import { IosProject } from "./ios/project";
import { VFS } from './vfs';

import { CapacitorConfig } from '@capacitor/cli';

export class CapacitorProject {
  ios: IosProject | null;
  android: AndroidProject | null;
  vfs: VFS;

  constructor(public config: CapacitorConfig) {
    this.ios = new IosProject(this);
    this.android = new AndroidProject(this);
    this.vfs = new VFS();
  }

  async load(): Promise<void> {
    await this.ios.load();
    await this.android.load();
  }
  async commit(): Promise<void> { }
}