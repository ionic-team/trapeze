import { pathExists } from '@ionic/utils-fs';
import { Logger } from '@ionic/cli-framework-output';
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

export class MobileProject {
  public framework: Framework | null = null;
  public ios: IosProject | null = null;
  public android: AndroidProject | null = null;
  vfs: VFS;

  constructor(
    public projectRoot: string,
    public config: MobileProjectConfig = {},
    public logger: Logger | null = null
  ) {
    this.vfs = new VFS();
    this.config.projectRoot = projectRoot;

    if (this.config.ios) {
      this.config.ios.path = join(this.projectRoot, this.config.ios.path ?? '');
    }
    if (this.config.android) {
      this.config.android.path = join(
        this.projectRoot,
        this.config.android.path ?? '',
      );
    }
  }

  getLogger() {
    return this.logger;
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
      this.config?.android?.path &&
      (await pathExists(this.config.android?.path))
    ) {
      this.android = new AndroidProject(this);
    }
    if (this.config?.ios?.path && (await pathExists(this.config.ios?.path))) {
      this.ios = new IosProject(this);
    }

    this.framework = await this.detectFramework();

    await this.ios?.load();
    await this.android?.load();
  }

  commit(): Promise<void> {
    return this.vfs.commitAll();
  }
}
