import { join } from 'path';
import fetch from 'cross-fetch';
import {
  pathExists,
  move,
  mkdir,
  mkdirp,
  readFile,
  remove,
  rmdir,
  writeFile,
  copy,
} from '@ionic/utils-fs';

import { MobileProject } from '../project';
import { AndroidResDir } from '../definitions';
import { GradleFile } from './gradle-file';
import { XmlFile } from '../xml';
import { PropertiesFile } from '../properties';
import { PlatformProject } from '../platform-project';
import { readSource } from '../read-src';
import { Logger } from '../logger';
import { compare } from '../util/gradle-versions';

export class AndroidProject extends PlatformProject {
  private manifest: XmlFile;
  private buildGradle: GradleFile | null = null;
  private appBuildGradle: GradleFile | null = null;

  constructor(project: MobileProject) {
    super(project);

    const manifestPath = this.getAndroidManifestPath();
    this.manifest = new XmlFile(manifestPath!, project.vfs);
  }

  async load() {
    try {
      await this.manifest.load();
      this.buildGradle = await this.loadGradle('build.gradle');
      this.appBuildGradle = await this.loadGradle('app/build.gradle');
    } catch (e) {
      this.setError(e as Error);
    }
  }

  getBuildGradle() {
    return this.buildGradle;
  }

  getAppBuildGradle() {
    return this.appBuildGradle;
  }

  getAndroidManifest() {
    return this.manifest;
  }

  /**
   * Get a project file container for the given path in the project root.
   * This will return an existing file container or create a new one.
   */
  getProjectFile<T>(path: string, create: (filename: string) => T): T | null {
    const root = this.project.config.android?.path;

    if (!root) {
      return null;
    }

    const filename = join(root, path);

    const existing = this.project.vfs.get(filename);

    if (existing) {
      return existing.getData() as T;
    }

    return create(filename);
  }

  getResourceXmlFile(resourcePath: string) {
    return this.getXmlFile(join(this.getResourcesPath(), resourcePath));
  }

  getXmlFile(path: string) {
    return this.getProjectFile(
      path,
      (filename: string) => new XmlFile(filename, this.project.vfs)
    );
  }

  getPropertiesFile(path: string) {
    return this.getProjectFile(
      path,
      (filename: string) => new PropertiesFile(filename, this.project.vfs)
    );
  }

  async getGradleFile(path: string) {
    if (path === 'build.gradle') {
      return this.buildGradle;
    } else if (path === 'app/build.gradle') {
      return this.appBuildGradle;
    }

    return this.loadGradle(path);
  }

  async setAppName(appName: string) {
    const application = this.manifest.find('manifest/application');
    if (!application) {
      Logger.v('android', 'setAppName', `No <application> node found in <manifest>`);
      return;
    }
    const label = application[0].getAttribute('android:label');
    Logger.v('android', 'setAppName', `current app label is ${label}`);

    if (label) {
      if (label.indexOf('@string') === 0) {
        Logger.v('android', 'setAppName', 'android:label pointing to strings.xml resource file. Reading values/strings.xml');

        const stringsFile = await this.getResourceXmlFile('values/strings.xml');

        if (!stringsFile) {
          Logger.v('android', 'setAppName', 'Unable to load values/strings.xml resource file');
          return;
        }

        await stringsFile.load();

        const attr = label.replace('@string/', '');

        // TODO: use the value specified in the @strings attribute 
        Logger.v('android', 'setAppName', `Updated values/strings.xml <string name="${attr}"> to <string name="${attr}">${appName}</string>`);
        stringsFile.replaceFragment(`resources/string[@name="${attr}"]`, `<string name="${attr}">${appName}</string>`);
      }
    } else {
      Logger.v('android', 'setAppName', `No android:label on <application> node, setting value directly`);
      application[0].setAttribute('android:label', appName);
    }
  }

  /**
   * Update the Android package name. This renames the package in `AndroidManifest.xml`,
   * the `applicationId` in `app/build.gradle`, and renames the java
   * package for the `MainActivity.java` file.
   *
   * This action will mutate the project on disk!
   */
  async setPackageName(packageName: string) {
    const sourceDir = join(this.getAppRoot()!, 'src', 'main', 'java');
    let hadPackageAttr = false;
    let oldPackageName = await this.manifest
      .getDocumentElement()
      ?.getAttribute('package');
    
    if (!oldPackageName) {
      oldPackageName = await this.appBuildGradle?.getApplicationId();
    } else {
      hadPackageAttr = true;
    }
    
    const oldPackageParts = oldPackageName?.split('.') ?? [];

    Logger.v('android', 'setPackageName', 'setting Android package name to', packageName, 'from', oldPackageName);

    if (packageName === oldPackageName) {
      return;
    }

    const existingPackage = join(sourceDir, ...oldPackageParts);
    if (!(await pathExists(existingPackage))) {
      throw new Error(
        'Current Java package name and directory structure do not match the <manifest> package attribute. Ensure these match before modifying the project package name',
      );
    }

    let activityName = '.MainActivity';
    if (hadPackageAttr) {
      this.manifest.getDocumentElement()?.setAttribute('package', packageName);
      activityName = `${packageName}.MainActivity`;
    }

    await this.appBuildGradle?.setApplicationId(packageName);
    await this.appBuildGradle?.setNamespace(packageName);
    Logger.v('android', 'setPackageName', `set manifest package attribute and applicationId to ${packageName}`);
    this.manifest.setAttrs('manifest/application/activity', {
      'android:name': activityName
    });
    Logger.v('android', 'setPackageName', `set <activity android:name="${packageName}.MainActivity"`);

    if (!this.getAppRoot()) {
      return;
    }

    const newPackageParts = packageName.split('.');

    const destDir = join(sourceDir, ...newPackageParts);

    const mainActivityName = this.getMainActivityFilename();

    Logger.v('android', 'setPackageName', `Got main activity name ${mainActivityName}`);

    let activityFile = join(sourceDir, ...oldPackageParts, mainActivityName);

    Logger.v('android', 'setPackageName', `Looking for old activity file at ${activityFile}`);

    // Make the new directory tree and any missing parents
    await mkdirp(destDir);
    // Move the old activity file over
    await move(activityFile, join(destDir, 'MainActivity.java'));

    // Try to delete the empty directories we left behind, starting
    // from the deepest
    let sourceDirLeaf = join(sourceDir, ...oldPackageParts);

    Logger.v('android', 'setPackageName', `removing old source dirs for old package (${sourceDirLeaf})`);

    for (const _ of oldPackageParts) {
      try {
        await rmdir(sourceDirLeaf);
      } catch (ex) {
        // This will fail if directory is not empty, that's fine, we won't delete those
      }
      sourceDirLeaf = join(sourceDirLeaf, '..');
    }

    // Rename the package in the main source file
    activityFile = join(sourceDir, ...newPackageParts, this.getMainActivityFilename());
    if (await pathExists(activityFile)) {
      Logger.v('android', 'setPackageName', `renaming package in source for activity file ${activityFile}`);
      const activitySource = await readFile(activityFile, {
        encoding: 'utf-8',
      });
      const newActivitySource = activitySource?.replace(
        /(package\s+)[^;]+/,
        `$1${packageName}`,
      );
      await writeFile(activityFile, newActivitySource);
    }
  }

  getMainActivityFilename() {
    const activity = this.manifest.find('manifest/application/activity');

    if (!activity) {
      return 'MainActivity.java';
    }

    const activityName = activity[0].getAttribute('android:name');
    const parts = activityName?.split('.');
    if (!parts) {
      return '';
    }
    return `${parts[parts.length - 1]}.java`;
  }

  async getMainActivityPath() {
    const packageName = await this.appBuildGradle?.getApplicationId();
    const activityName = this.getMainActivityFilename();
    const packageParts = packageName?.split('.') ?? [];

    return join('app', 'src', 'main', 'java', ...packageParts, activityName);
  }

  async getGradlePluginVersion() {
    await this.buildGradle?.parse();

    const found = this.buildGradle?.find({
      buildscript: {
        dependencies: {
          classpath: {}
        }
      }
    });

    const sources = (found ?? []).map(f => this.buildGradle?.getSource(f.node) ?? '');

    const gradleLine = sources.find(s => s.indexOf('com.android.tools.build:gradle:'));

    return gradleLine?.match(/:([\d.]+)/)?.[1] ?? null;
  }

  async getPackageName() {
    const namespace = await this.appBuildGradle?.getNamespace();

    if (namespace) {
      return namespace;
    }

    return this.manifest.getDocumentElement()?.getAttribute('package');
  }

  setVersionCode(versionCode: number) {
    if ((versionCode as any) === '') {
      versionCode = 1;
    }

    return this.appBuildGradle?.setVersionCode(typeof versionCode === 'number' ? versionCode : parseInt(versionCode, 10));
  }

  async getVersionCode(): Promise<number | null> {
    return (await this.appBuildGradle?.getVersionCode()) ?? null;
  }

  incrementVersionCode(): Promise<void> {
    return this.appBuildGradle?.incrementVersionCode() ?? Promise.resolve();
  }

  setVersionName(versionName: string) {
    return this.appBuildGradle?.setVersionName(versionName);
  }

  getVersionName(): Promise<string | null> {
    return this.appBuildGradle?.getVersionName() ?? Promise.resolve(null);
  }

  setVersionNameSuffix(versionNameSuffix: string) {
    return this.appBuildGradle?.setVersionNameSuffix(versionNameSuffix);
  }

  getVersionNameSuffix(): Promise<string | null> {
    return this.appBuildGradle?.getVersionNameSuffix() ?? Promise.resolve(null);
  }

  /**
   * Add a new file to the given resources directory with the given contents and
   * given file name
   **/
  getResource(
    resDir: AndroidResDir,
    file: string,
    options: { encoding: 'utf-8' | string } | null = { encoding: 'utf-8' },
  ) {
    const root = this.getResourcesRoot();
    if (!root) {
      return;
    }

    const dir = join(root, resDir);

    if (!options) {
      return readFile(join(dir, file));
    }

    return readFile(join(dir, file), options);
  }
  /**
   * Add a new file to the given resources directory with the given contents and
   * given file name
   **/
  async addResource(resDir: AndroidResDir, file: string, contents: string) {
    const root = this.getResourcesRoot();
    if (!root) {
      return;
    }

    const dir = join(root, resDir);

    Logger.v(`android`, 'addResource', `add res file ${file} to ${resDir}`);

    if (!(await pathExists(dir))) {
      await mkdir(dir);
    }

    return writeFile(join(dir, file), contents);
  }

  async copyFile(src: string, dest: string): Promise<void> {
    if (!this.project?.config?.android?.path) {
      return Promise.reject();
    }
    const destPath = join(this.project.config.android.path, dest);

    Logger.v(`android`, `copyFile`, `copying ${src} to ${destPath}`);

    if (/^(https?:\/\/)/.test(src)) {
      const res = await fetch(src);
      return writeFile(destPath, Buffer.from(await res.arrayBuffer()));
    }

    const srcPath = join(this.project.config.android.path, src);
    return copy(srcPath, destPath);
  }

  /**
   * Copy the given source into the given resources directory with the
   * given file name
   **/
  async copyToResources(resDir: AndroidResDir, file: string, source: string) {
    const root = this.getResourcesRoot();
    if (!root) {
      return;
    }

    const dir = join(root, resDir);

    if (!(await pathExists(dir))) {
      await mkdir(dir);
    }

    Logger.v(`android`, `copyToResources`, `copying ${file} to Android resources at ${join(dir, file)}`);

    const sourceData = await readSource(source);
    return writeFile(join(dir, file), sourceData);
  }

  private getAndroidManifestPath(): string | null {
    if (!this.project.config.android?.path) {
      return null;
    }
    return join(
      this.project.config.android?.path,
      'app',
      'src',
      'main',
      'AndroidManifest.xml',
    );
  }

  getResourcesPath(): string {
    return join('app', 'src', 'main', 'res');
  }

  getResourcesRoot(): string | null {
    if (!this.project.config.android?.path) {
      return null;
    }

    return join(this.project.config.android?.path, this.getResourcesPath());
  }

  private getAppRoot(): string | null {
    if (!this.project.config.android?.path) {
      return null;
    }

    // TODO: Don't hard-code app
    return join(this.project.config.android?.path, 'app');
  }

  private async loadGradle(path: string): Promise<GradleFile | null> {
    if (!this.project.config.android?.path) {
      return null;
    }
    const filename = join(this.project.config.android?.path, path);

    return new GradleFile(filename, this.project.vfs);
  }
}
