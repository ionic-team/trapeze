import { copy, pathExists, writeFile } from '@ionic/utils-fs';
import { join } from 'path';

import { AndroidProject } from './android/project';
import { MobileProjectConfig } from './config';
import { Framework } from './frameworks';
import { CapacitorFramework } from './frameworks/capacitor';
import { CordovaFramework } from './frameworks/cordova';
import { FlutterFramework } from './frameworks/flutter';
import { DotNetMauiFramework } from './frameworks/dotnet-maui';
import { ReactNativeFramework } from './frameworks/react-native';
import { IosProject } from './ios/project';
import { VFS } from './vfs';
import { NativeIosFramework } from './frameworks/native-ios';
import { NativeAndroidFramework } from './frameworks/native-android';
import { NativeScriptFramework } from './frameworks/nativescript';
import { Logger } from './logger';
import { Assets } from './assets/asset-types'

export class MobileProject {
  public framework: Framework | null = null;
  public ios: IosProject | null = null;
  public android: AndroidProject | null = null;
  vfs: VFS;

  assets: Assets | null = null;
  directory: string | null = null;
  assetDir: string | null = null;

  constructor(
    public projectRoot: string,
    public config: MobileProjectConfig = {},
  ) {
    this.vfs = new VFS();
    this.config.projectRoot = projectRoot;

    if (typeof config.enableAndroid === 'undefined') {
      config.enableAndroid = true;
    }

    if (typeof config.enableIos === 'undefined') {
      config.enableIos = true;
    }
  }

  async detectFramework(): Promise<Framework | null> {
    const frameworks = [
      FlutterFramework,
      ReactNativeFramework,
      CapacitorFramework,
      CordovaFramework,
      DotNetMauiFramework,
      NativeScriptFramework,
      NativeIosFramework,
      NativeAndroidFramework,
    ];
    const results = await Promise.all(
      frameworks.map(f => f.getFramework(this)),
    );

    return results.filter(f => f).find(f => !!f) ?? null;
  }

  async load(): Promise<void> {
    if (
      this.config?.enableAndroid &&
      this.config?.android?.path &&
      (await pathExists(this.config.android?.path))
    ) {
      this.android = new AndroidProject(this);
      await this.android?.load();
    }
    if (
      this.config?.enableIos &&
      this.config?.ios?.path &&
      (await pathExists(this.config.ios?.path))
    ) {
      this.ios = new IosProject(this);
      await this.ios?.load();
    }

    this.framework = await this.detectFramework();
  }

  commit(): Promise<void> {
    return this.vfs.commitAll(this);
  }

  async copyFile(src: string, dest: string): Promise<void> {
    const destPath = join(this.projectRoot, dest);

    Logger.v(`project`, `copyFile`, `copying ${src} to ${destPath}`);

    if (/^(https?:\/\/)/.test(src)) {
      const res = await fetch(src);
      return writeFile(destPath, Buffer.from(await res.arrayBuffer()));
    }

    const srcPath = join(this.projectRoot, src);
    return copy(srcPath, destPath);
  }

  async androidExists(): Promise<boolean> {
    return this.config.android?.path !== undefined && (await pathExists(this.config.android?.path));
  }

  async iosExists(): Promise<boolean> {
    return this.config.ios?.path !== undefined && (await pathExists(this.config.ios?.path));
  }

  async assetDirExists(): Promise<boolean> {
    if (this.assetDir !== null) {
      return pathExists(this.assetDir);
    } else {
      return false
    }
  }
}
