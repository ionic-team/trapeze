import { dirname, join, relative } from 'path';
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
import { readdir } from 'fs/promises';

import { MobileProject } from '../project';
import { AndroidResDir } from '../definitions';
import { GradleFile } from './gradle-file';
import { XmlFile } from '../xml';
import { PropertiesFile } from '../properties';
import { PlatformProject } from '../platform-project';
import { readSource } from '../read-src';
import { Logger } from '../logger';
import { listFilesRecursive } from '../util/fs';
import { compare } from '../util/gradle-versions';

const LAUNCHER_ACTIVITY = 'manifest/application/activity[intent-filter/action/@android:name="android.intent.action.MAIN"]';

// The Capacitor string resources that hold a copy of the package name
const PACKAGE_NAME_STRINGS = ['package_name', 'custom_url_scheme'];

// Used when the manifest declares no activity to take the name from
const DEFAULT_MAIN_ACTIVITY_NAME = 'MainActivity';

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
      this.manifest.setAttrs('manifest/application', { 'android:label': appName });
    }
  }

  /**
   * Update the Android package name. This renames the package in `AndroidManifest.xml`,
   * the `applicationId` and `namespace` in `app/build.gradle`, and moves the sources of
   * the old package to the new one.
   *
   * This action will mutate the project on disk!
   */
  async setPackageName(packageName: string) {
    const manifestPackage = this.manifest.getDocumentElement()?.getAttribute('package');
    const oldPackageName =
      manifestPackage || (await this.getPackageName()) || (await this.appBuildGradle?.getApplicationId());

    if (!oldPackageName) {
      throw new Error(
        'Unable to detect the current package name. Set the package attribute in AndroidManifest.xml or the namespace or applicationId in app/build.gradle before modifying the project package name',
      );
    }

    Logger.v('android', 'setPackageName', 'setting Android package name to', packageName, 'from', oldPackageName);

    if (packageName === oldPackageName) {
      return;
    }

    const sourceDir = join(this.getAppRoot()!, 'src', 'main', 'java');
    const oldPackageParts = oldPackageName.split('.');
    const oldPackageDir = join(sourceDir, ...oldPackageParts);

    if (!(await pathExists(oldPackageDir))) {
      throw new Error(
        'Current Java package name and directory structure do not match the <manifest> package attribute. Ensure these match before modifying the project package name',
      );
    }

    if (manifestPackage) {
      this.manifest.setAttrs('manifest', { package: packageName });
    }

    this.setLauncherActivityPackage(packageName);

    await this.appBuildGradle?.setApplicationId(packageName);
    await this.appBuildGradle?.setNamespace(packageName);
    Logger.v('android', 'setPackageName', `set applicationId and namespace to ${packageName}`);

    const movedFiles = await this.movePackageSources(oldPackageDir, join(sourceDir, ...packageName.split('.')));
    await this.renamePackageInSources(movedFiles, oldPackageName, packageName);
    await this.removeOldPackageDirs(sourceDir, oldPackageParts);
    await this.renamePackageInStrings(oldPackageName, packageName);
  }

  /**
   * Point the launcher activity at the new package. Activities of other packages, and
   * activity names that are relative to the package (`.MainActivity`), are left alone.
   */
  private setLauncherActivityPackage(packageName: string) {
    const activityName = this.manifest.find(LAUNCHER_ACTIVITY)?.[0]?.getAttribute('android:name');

    if (!activityName || activityName.startsWith('.')) {
      return;
    }

    const newActivityName = `${packageName}.${activityName.split('.').pop()}`;

    Logger.v('android', 'setPackageName', `set launcher <activity android:name="${newActivityName}">`);

    this.manifest.setAttrs(LAUNCHER_ACTIVITY, {
      'android:name': newActivityName
    });
  }

  /**
   * Move every file of the old package, sub packages included, to the new package
   * directory and return the new file paths.
   *
   * Every destination is checked before the first file is moved, so a file that is in
   * the way cannot leave the sources split across the old and the new package.
   */
  private async movePackageSources(oldPackageDir: string, newPackageDir: string) {
    const files = (await listFilesRecursive(oldPackageDir)).map(file => ({
      file,
      dest: join(newPackageDir, relative(oldPackageDir, file)),
    }));

    for (const { dest } of files) {
      if (await pathExists(dest)) {
        throw new Error(
          `Unable to move the sources to the new package: a file already exists at ${dest}. Remove it before modifying the project package name`,
        );
      }
    }

    for (const { file, dest } of files) {
      Logger.v('android', 'setPackageName', `moving ${file} to ${dest}`);

      await mkdirp(dirname(dest));
      await move(file, dest);
    }

    return files.map(({ dest }) => dest);
  }

  /**
   * Rename the package declaration and the imports of the old package in the given
   * source files. Sources that declare a package outside of the old one are left alone.
   */
  private async renamePackageInSources(files: string[], oldPackageName: string, packageName: string) {
    // Anchored to the start of a line so that the word package in a header comment is
    // not mistaken for the declaration
    const packageDeclaration = /^([ \t]*package\s+)([\w.]+)/m;
    const oldPackageImport = new RegExp(`(import\\s+(static\\s+)?)${oldPackageName.replace(/\./g, '\\.')}\\.`, 'g');

    for (const file of files.filter(f => /\.(java|kt)$/.test(f))) {
      const source = await readFile(file, { encoding: 'utf-8' });
      const declaredPackage = source.match(packageDeclaration)?.[2];

      if (!declaredPackage) {
        continue;
      }

      if (declaredPackage !== oldPackageName && !declaredPackage.startsWith(`${oldPackageName}.`)) {
        continue;
      }

      Logger.v('android', 'setPackageName', `renaming package in source file ${file}`);

      const subPackage = declaredPackage.slice(oldPackageName.length);
      const newSource = source
        .replace(packageDeclaration, (_, keyword) => `${keyword}${packageName}${subPackage}`)
        .replace(oldPackageImport, (_, keyword) => `${keyword}${packageName}.`);

      await writeFile(file, newSource);
    }
  }

  /**
   * Remove the directories the old package left behind, deepest first. Directories that
   * still have contents are kept.
   */
  private async removeOldPackageDirs(sourceDir: string, oldPackageParts: string[]) {
    Logger.v('android', 'setPackageName', `removing old source dirs for old package (${oldPackageParts.join('.')})`);

    await this.removeDirTreeIfEmpty(join(sourceDir, ...oldPackageParts));

    for (let depth = oldPackageParts.length - 1; depth > 0; depth--) {
      await this.removeDirIfEmpty(join(sourceDir, ...oldPackageParts.slice(0, depth)));
    }
  }

  private async removeDirTreeIfEmpty(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        await this.removeDirTreeIfEmpty(join(dir, entry.name));
      }
    }

    await this.removeDirIfEmpty(dir);
  }

  private async removeDirIfEmpty(dir: string) {
    try {
      await rmdir(dir);
    } catch (e) {
      // rmdir only fails when the directory still has contents, which is when we want to keep it
    }
  }

  /**
   * Keep the Capacitor string resources that mirror the package name in sync. Values that
   * hold something else, because the project isn't a Capacitor one or they were edited by
   * hand, are left alone.
   */
  private async renamePackageInStrings(oldPackageName: string, packageName: string) {
    const stringsPath = join(this.getResourcesRoot() ?? '', 'values', 'strings.xml');

    if (!(await pathExists(stringsPath))) {
      return;
    }

    // Opening a file adds it to the files to commit, so keep it closed when it doesn't
    // mention the old package name at all
    if (!(await readFile(stringsPath, { encoding: 'utf-8' })).includes(oldPackageName)) {
      return;
    }

    const stringsFile = this.getResourceXmlFile('values/strings.xml');

    if (!stringsFile) {
      return;
    }

    await stringsFile.load();

    for (const name of PACKAGE_NAME_STRINGS) {
      const target = `resources/string[@name="${name}"]`;

      if (stringsFile.find(target)?.[0]?.textContent !== oldPackageName) {
        continue;
      }

      Logger.v('android', 'setPackageName', `set <string name="${name}"> to ${packageName}`);

      stringsFile.replaceFragment(target, `<string name="${name}">${packageName}</string>`);
    }
  }

  /**
   * Get the Java file name of the main activity. Use `getMainActivityPath()` to get the
   * name of the source file the project actually has, which can be a Kotlin one.
   */
  getMainActivityFilename(): string {
    return `${this.getMainActivityName()}.java`;
  }

  async getMainActivityPath() {
    const packageParts = (await this.getPackageName())?.split('.') ?? [];

    return join('app', 'src', 'main', 'java', ...packageParts, await this.resolveMainActivityFilename());
  }

  /**
   * Get the file name of the main activity, with the source file extension the
   * project actually uses.
   */
  private async resolveMainActivityFilename(): Promise<string> {
    const activityName = this.getMainActivityName();
    const packageParts = (await this.getPackageName())?.split('.') ?? [];
    const kotlinActivity = `${activityName}.kt`;

    if (await pathExists(join(this.getAppRoot() ?? '', 'src', 'main', 'java', ...packageParts, kotlinActivity))) {
      return kotlinActivity;
    }

    return `${activityName}.java`;
  }

  private getMainActivityName() {
    const activity =
      this.manifest.find(LAUNCHER_ACTIVITY)?.[0] ?? this.manifest.find('manifest/application/activity')?.[0];

    const activityName = activity?.getAttribute('android:name');

    return activityName?.split('.').pop() ?? DEFAULT_MAIN_ACTIVITY_NAME;
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
