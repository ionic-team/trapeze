import { join } from 'path';
import gradleToJs from 'gradle-to-js/lib/parser.js'
import { pathExists, mkdir, readFile, writeFile } from '@ionic/utils-fs';


import { CapacitorProject } from "../project";
import { AndroidManifest } from './manifest';

import { AndroidResDir } from '../definitions';

export class AndroidProject {
  private manifest: AndroidManifest;
  private appBuildGradle: string | null = null;

  constructor(private project: CapacitorProject) {
    const manifestPath = this.getAndroidManifestPath();
    if (!manifestPath) {
      throw new Error('Unable to load AndroidManifest.xml for project');
    }
    this.manifest = new AndroidManifest(manifestPath);
  }

  async load() {
    await this.manifest.load();
    this.appBuildGradle = await this.loadAppBuildGradle();
  }

  async commit() {
    // TODO: Do this  
  }

  getAndroidManifest() {
    return this.manifest;
  }

  async setPackageName(packageName: string) {
    this.manifest.getDocumentElement()?.setAttribute('package', packageName);
  }

  getPackageName() {
    return this.manifest.getDocumentElement()?.getAttribute('package');
  }

  async setVersionCode(versionCode: number) {
    this.appBuildGradle = this.appBuildGradle?.replace(/(versionCode\s+)\w+/, `$1${versionCode}`) || null;
  }

  getVersionCode(): number | null {
    const versionCode = this.appBuildGradle?.match(/versionCode\s+(\w+)/);
    if (!versionCode) {
      return null;
    }
    return parseInt(versionCode[1]);
  }

  incrementVersionCode() {
    const versionCode = this.appBuildGradle?.match(/versionCode\s+(\w+)/);
    if (!versionCode) {
      return;
    }
    const num = parseInt(versionCode[1]);
    if (!isNaN(num)) {
      this.appBuildGradle = this.appBuildGradle?.replace(/(versionCode\s+)\w+/, `$1${num + 1}`) || null;
    }
  }

  setVersionName(versionName: string) {
    this.appBuildGradle = this.appBuildGradle?.replace(
      /(versionName\s+)["'][^"']+["']/,
      `$1"${versionName}"`,
    ) || null;
  }

  getVersionName(): string | null {
    const versionName = this.appBuildGradle?.match(/versionName\s+["']([^"']+)["']/) || null;
    if (!versionName) {
      return null;
    }
    return versionName[1];
  }

  /**
   * Add a new file to the given resources directory with the given contents and
   * given file name
   **/
  getResource(resDir: AndroidResDir, file: string, options = { encoding: 'utf-8' }) {
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

  async injectGradle(path: string, _gradleObject: any) {
    if (!this.project.config.android?.path) {
      return;
    }
    const filename = join(this.project.config.android?.path, path);
    const parsed = await gradleToJs.parseFile(filename);
    console.log(`----GRADLE-----`);
    console.log(JSON.stringify(parsed, null, 2));
    console.log(`----------------------`);
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

  private async loadAppBuildGradle(): Promise<string | null> {
    if (!this.project.config.android?.path) {
      return null;
    }
    const filename = join(this.project.config.android?.path, 'app', 'build.gradle');
    return readFile(filename, { encoding: 'utf-8' });
  }
}