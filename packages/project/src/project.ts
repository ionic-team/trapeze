import { CapacitorConfig } from '@capacitor/cli';

import { pathExists } from '@ionic/utils-fs';

import { AndroidProject } from "./android/project";
import { IosProject } from "./ios/project";
import { VFS } from './vfs';


export class CapacitorProject {
  ios: IosProject | null = null;
  android: AndroidProject | null = null;
  vfs: VFS;

  constructor(public config: CapacitorConfig) {
    this.vfs = new VFS();
  }

  async load(): Promise<void> {
    if (this.config.android?.path && await pathExists(this.config.android?.path)) {
      this.android = new AndroidProject(this);
    }
    if (this.config.ios?.path && await pathExists(this.config.ios?.path)) {
      this.ios = new IosProject(this);
    }

    await this.ios?.load();
    await this.android?.load();
  }

  commit(): Promise<void> {
    return this.vfs.commitAll();
  }
}