import { join } from 'path';
import { pathExists, move, mkdir, mkdirp, readFile, remove, rmdir, writeFile } from '@ionic/utils-fs';


import { CapacitorProject } from "../project";
import { AndroidManifest } from './manifest';

import { AndroidResDir } from '../definitions';
import { GradleFile } from './gradle-file';

export class AndroidProject {
  private manifest: AndroidManifest;
  private buildGradle: GradleFile | null = null;
  private appBuildGradle: GradleFile | null = null;

  constructor(private project: CapacitorProject) {
    const manifestPath = this.getAndroidManifestPath();
    if (!manifestPath) {
      throw new Error('Unable to load AndroidManifest.xml for project');
    }
    this.manifest = new AndroidManifest(manifestPath, project.vfs);
  }

  async load() {
    await this.manifest.load();
    this.buildGradle = await this.loadGradle('build.gradle');
    this.appBuildGradle = await this.loadGradle('app/build.gradle');
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

  getGradleFile(path: string) {
    if (path === 'build.gradle') {
      return this.buildGradle;
    } else if (path === 'app/build.gradle') {
      return this.appBuildGradle;
    }
    return null;
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
    const oldPackageName = await this.manifest.getDocumentElement()?.getAttribute('package');
    const oldPackageParts = oldPackageName?.split('.') ?? [];

    if (packageName === oldPackageName) {
      return;
    }

    const existingPackage = join(sourceDir, ...oldPackageParts);
    if (!await pathExists(existingPackage)) {
      throw new Error('Current Java package name and directory structure do not match the <manifest> package attribute. Ensure these match before modifying the project package name');
    }

    this.manifest.getDocumentElement()?.setAttribute('package', packageName);
    await this.appBuildGradle?.setApplicationId(packageName);
    this.manifest.setAttrs('manifest/application/activity', {
      'android:name': `${packageName}.MainActivity`
    });

    if (!this.getAppRoot()) {
      return;
    }

    const newPackageParts = packageName.split('.');

    const destDir = join(sourceDir, ...newPackageParts);

    let activityFile = join(sourceDir, ...oldPackageParts, 'MainActivity.java');

    // Make the new directory tree and any missing parents
    await mkdirp(destDir);
    // Move the old activity file over
    await move(activityFile, join(destDir, 'MainActivity.java'));

    // Try to delete the empty directories we left behind, starting
    // from the deepest
    let sourceDirLeaf = join(sourceDir, ...oldPackageParts);

    for (const _ of oldPackageParts) {
      try {
        await rmdir(sourceDirLeaf);
      } catch (ex) {
        // This will fail if directory is not empty, that's fine, we won't delete those
      }
      sourceDirLeaf = join(sourceDirLeaf, '..');
    }

    // Rename the package in the main source file
    activityFile = join(sourceDir, ...newPackageParts, 'MainActivity.java');
    if (await pathExists(activityFile)) {
      const activitySource = await readFile(activityFile, { encoding: 'utf-8' });
      const newActivitySource = activitySource?.replace(
        /(package\s+)[^;]+/,
        `$1${packageName}`,
      );
      await writeFile(activityFile, newActivitySource);
    }
  }


  getPackageName() {
    return this.manifest.getDocumentElement()?.getAttribute('package');
  }

  setVersionCode(versionCode: number) {
    return this.appBuildGradle?.setVersionCode(versionCode);
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

  /**
   * Add a new file to the given resources directory with the given contents and
   * given file name
   **/
  getResource(resDir: AndroidResDir, file: string, options: { encoding: 'utf-8' | string } | null = { encoding: 'utf-8' }) {
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

    if (!(await pathExists(dir))) {
      await mkdir(dir);
    }

    return writeFile(join(dir, file), contents);
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

    const sourceData = await readFile(source);
    return writeFile(join(dir, file), sourceData);
  }

  /**
   * Copy the given source into the given top level directory with the
   * given file name
   **/
  async copyFile(file: string, source: string) {
    const root = this.getAppRoot();
    if (!root) {
      return;
    }

    const sourceData = await readFile(source);
    return writeFile(join(root, file), sourceData);
  }

  private getAndroidManifestPath(): string | null {
    if (!this.project.config.android?.path) {
      return null;
    }
    return join(this.project.config.android?.path, 'app', 'src', 'main', 'AndroidManifest.xml');
  }

  private getResourcesRoot(): string | null {
    if (!this.project.config.android?.path) {
      return null;
    }
    return join(this.project.config.android?.path, 'app', 'src', 'main', 'res');
  }

  private getAppRoot(): string | null {
    if (!this.project.config.android?.path) {
      return null;
    }
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