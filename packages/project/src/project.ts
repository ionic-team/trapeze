import { pathExists } from '@ionic/utils-fs';

import { AndroidProject } from "./android/project";
import { MobileProjectConfig } from './config';
import { Framework } from './frameworks';
import { CapacitorFramework } from './frameworks/capacitor';
import { CordovaFramework } from './frameworks/cordova';
import { FlutterFramework } from './frameworks/flutter';
import { DotNetMauiFramework } from './frameworks/dotnet-maui';
import { NativeFramework } from './frameworks/native';
import { ReactNativeFramework } from './frameworks/react-native';
import { IosProject } from "./ios/project";
import { VFS } from './vfs';


export class MobileProject {
  framework: Framework | null = null;
  ios: IosProject | null = null;
  android: AndroidProject | null = null;
  vfs: VFS;

  constructor(projectRoot: string, public config: MobileProjectConfig = {}) {
    this.vfs = new VFS();
    this.config.projectRoot = projectRoot;
  }

  async detectFramework(): Promise<Framework | null> {
    const frameworks = [NativeFramework, FlutterFramework, ReactNativeFramework, CapacitorFramework, CordovaFramework, DotNetMauiFramework];
    return Promise.any(frameworks.map(f => f.getFramework(this)));
  }

  async load(): Promise<void> {
    if (this.config?.android?.path && await pathExists(this.config.android?.path)) {
      this.android = new AndroidProject(this);
    }
    if (this.config?.ios?.path && await pathExists(this.config.ios?.path)) {
      this.ios = new IosProject(this);
    }

    await this.ios?.load();
    await this.android?.load();
  }

  commit(): Promise<void> {
    return this.vfs.commitAll();
  }
}