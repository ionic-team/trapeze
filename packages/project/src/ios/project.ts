import plist from 'plist';
import path, { join } from 'path';
import fetch from 'cross-fetch';
import { copy, pathExists, readdir, writeFile } from '@ionic/utils-fs';

import { parsePbxProject, pbxReadString, pbxSerializeString } from "../util/pbx";
import { MobileProject } from "../project";
import { IosPbxProject, IosEntitlements, IosFramework, IosBuildName, IosTarget, IosTargetName, IosTargetBuildConfiguration, IosFrameworkOpts } from '../definitions';
import { VFSRef, VFSFile } from '../vfs';
import { XmlFile } from '../xml';
import { PlistFile } from '../plist';
import { PlatformProject } from '../platform-project';
import { Logger } from '../logger';
import { assertParentDirs } from '../util/fs';

const defaultEntitlementsPlist = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
</dict>
</plist>
`;

const defaultInfoPlist = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
</dict>
</plist>
`;

/* Some of the types are unwieldy in this file but the
  pbxProject methods are sensitive to null vs undefined
  so I've tried to accurately map what it expects. */

/**
 * An instance of an IosProject in a mobile project
 */
export class IosProject extends PlatformProject {
  private pbxProject: IosPbxProject | null = null;

  constructor(project: MobileProject) {
    super(project);
  }

  private log(op: string, targetName: string | null, buildName: string | null | undefined, msg: string) {
    Logger.v(`ios`, op, `(target: ${targetName}, build: ${buildName}): ${msg}`);
  }

  async load() {
    try {
      const proj = await this.pbx();
      this.pbxProject = proj;
    } catch (e) {
      this.setError(e as Error);
    }

  }

  /**
   * Get a project file container for the given path in the project root.
   * This will return an existing file container or create a new one.
   */
  getProjectFile<T>(path: string, create: (filename: string) => T): T | null {
    const root = this.project.config.ios?.path;

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

  async getXmlFile(path: string) {
    return this.getProjectFile(path, (filename: string) => new XmlFile(filename, this.project.vfs));
  }

  async getPlistFile(path: string) {
    return this.getProjectFile(path, (filename: string) => new PlistFile(filename, this.project.vfs));
  }

  getPbxProject() {
    return this.pbxProject;
  }

  /**
   * Get all targets in the project
   */
  getTargets(): IosTarget[] | null {
    if (!this.pbxProject) {
      return null;
    }

    const pbxNative = this.pbxProject?.pbxNativeTargetSection();

    return this.makeTargets(this.pbxProject, pbxNative);
  }

  /**
   * Get the target with the given name
   */
  getTarget(name: string): IosTarget | null {
    return this.getTargets()?.find(t => t.name === name || t.name === `\"${name}\"`) || null;
  }

  /**
   * Get the main app target in the project.
   */
  getAppTarget(): IosTarget | null {
    return this.getTargets()?.find(t => t.productType === '"com.apple.product-type.application"') || null;
  }

  /**
   * Get the name of the main app target in the project
   */
  getAppTargetName(): string | null {
    return this.getTargets()?.find(t => t.productType === '"com.apple.product-type.application"')?.name || null;
  }

  /**
   * Get the bundle id (aka the PRODUCT_BUNDLE_IDENTIFIER) for the given target and build. If build is null
   * the value for all build targets (Debug and Release) will be set to the same value. If target is null
   * the default app target will be used.
   */
  getBundleId(targetName: IosTargetName | null, buildName?: string): string | null {
    targetName = this.assertTargetName(targetName);

    if (buildName) {
      return this.getTarget(targetName)?.buildConfigurations.find(c => c.name === buildName)?.buildSettings?.['PRODUCT_BUNDLE_IDENTIFIER'];
    }

    return this.getTarget(targetName)?.buildConfigurations[0]?.buildSettings?.['PRODUCT_BUNDLE_IDENTIFIER'];
  }

  /**
   * Set the bundle id (aka the PRODUCT_BUNDLE_IDENTIFIER) for the given target and build. If build is null
   * the value for all build targets (Debug and Release) will be set to the same value. If target is null
   * the default app target will be used.
   */
  setBundleId(targetName: IosTargetName | null, buildName: IosBuildName | null, bundleId: string) {
    targetName = this.assertTargetName(targetName);

    this.log('setBundleId', targetName, buildName, `to ${bundleId}`);

    this.pbxProject?.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', pbxSerializeString(bundleId), buildName, targetName);
  }

  /**
   * Get the build configurations for a given target.
   */
  getBuildConfigurations(targetName: IosTargetName | null): IosTargetBuildConfiguration[] {
    targetName = this.assertTargetName(targetName);

    return this.getTarget(targetName)?.buildConfigurations ?? [];
  }

  /**
   * Get the build configuration names (ex: Debug, Release) for a given target.
   */
  getBuildConfigurationNames(targetName: IosTargetName | null): string[] {
    return this.getBuildConfigurations(targetName).map(c => c.name);
  }

  /**
   * Set the product name for the given target. If the `targetName` is null the main app target is used.
   */
  setProductName(targetName: IosTargetName | null, productName: string) {
    targetName = this.assertTargetName(targetName);

    this.log(`setProductName`, targetName, null, `PRODUCT_NAME to ${productName}`);

    this.pbxProject?.updateBuildProperty('PRODUCT_NAME', pbxSerializeString(productName), null, targetName);
  }

  /**
   * Get the product name for the given target. If the `targetName` is null the main app target is used.
   */
  getProductName(targetName?: IosTargetName | undefined): string | null {
    targetName = this.assertTargetName(targetName || null);

    return this.getTarget(targetName)?.productName || null;
  }

  /**
   * Set the build number (aka the `CURRENT_PROJECT_VERSION`) for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the value is set for both builds (Debug/Release);
   */
  async setBuild(targetName: IosTargetName | null, buildName: IosBuildName | null, buildNumber: number | null) {
    this.pbxProject?.updateBuildProperty('CURRENT_PROJECT_VERSION', buildNumber ?? 1, buildName, targetName);

    this.log(`setBuild`, targetName, buildName, `to ${buildNumber ?? 1}`);

    const file = await this.getInfoPlist(targetName, buildName ?? undefined);
    if (!file || !this.project?.config.ios?.path) {
      throw new Error('Unable to load plist file');
    }

    const filename = join(this.project.config.ios.path, file);

    const parsed = await this.plist(filename);
    parsed.set({ 'CFBundleVersion': '$(CURRENT_PROJECT_VERSION)' });
    this.log(`setBuild`, targetName, buildName, `CFBundleVersion to $(CURRENT_PROJECT_VERSION)`);
    this.project.vfs.set(filename, parsed);
  }

  /**
   * Get the build number (aka the `CURRENT_PROJECT_VERSION`) for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the value is set for both builds (Debug/Release);
   */
  async getBuild(targetName: IosTargetName | null, buildName?: IosBuildName | null | undefined) {
    const currentProjectVersion = this.pbxProject?.getBuildProperty('CURRENT_PROJECT_VERSION', buildName ? buildName : undefined/* must use undefined if null */, targetName);

    if (currentProjectVersion) {
      return currentProjectVersion;
    }

    const file = await this.getInfoPlist(targetName, buildName ?? undefined);
    if (!file || !this.project?.config.ios?.path) {
      throw new Error('Unable to load plist file');
    }

    const filename = join(this.project.config.ios.path, file);

    const parsed = await this.plist(filename);
    const doc = parsed.getDocument() ?? {};
    return doc['CFBundleVersion'];
  }

  /**
   * Increment the build number for the given build name. If the build
   * name is not specified, both Debug and Release builds are incremented.
   */
  async incrementBuild(targetName?: IosTargetName | undefined | null, buildName?: IosBuildName | null | undefined) {
    targetName = this.assertTargetName(targetName || null);

    const num = await this.getBuild(targetName ?? null, buildName);

    if (!isNaN(num)) {
      // If the value is a number, increment it
      return this.setBuild(targetName ?? null, buildName ?? null, num + 1);
    } else {
      // Otherwise, we need to check if there's a build property set for CURRENT_PROJECT_VERSION and create it if not
      let currentProjectVersion = this.pbxProject?.getBuildProperty('CURRENT_PROJECT_VERSION', buildName ? buildName : undefined/* must use undefined if null */, targetName);
      if (!currentProjectVersion) {
        this.log(`incrementBuild`, targetName, buildName, `Setting initial value for CURRENT_PROJECT_VERSION to ensure incremented build number works`);
        // Set an initial value for CURRENT_PROJECT_VERSION
        this.pbxProject?.updateBuildProperty('CURRENT_PROJECT_VERSION', 1, buildName, targetName);
      } else {
        // There's already a CURRENT_PROJECT_VERSION set, which shouldn't happen, so do nothing
      }
    }
  }

  /**
   * Set the version (aka `MARKETING_VERSION`) for the given build (Debug/Release/etc)
   */
  async setVersion(targetName: IosTargetName | null, buildName: IosBuildName | null, version: string) {
    targetName = this.assertTargetName(targetName || null);

    this.pbxProject?.updateBuildProperty('MARKETING_VERSION', pbxSerializeString(version), buildName, targetName);

    this.log(`setVersion`, targetName, buildName, `to ${pbxSerializeString(version)}`);

    const file = await this.getInfoPlist(targetName, buildName ?? undefined);
    if (!file || !this.project?.config.ios?.path) {
      throw new Error('Unable to load plist file');
    }

    const filename = join(this.project.config.ios.path, file);

    const parsed = await this.plist(filename);
    this.log(`setVersion`, targetName, buildName, `Updated CFBundleShortVersionString to $(MARKETING_VERSION) to ensure updated version works`);
    parsed.set({'CFBundleShortVersionString': '$(MARKETING_VERSION)'});
    this.project.vfs.set(filename, parsed);
  }

  /**
   * Get the version (aka the `MARKETING_VERSION`) for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the value is set for both builds (Debug/Release);
   */
  getVersion(targetName: IosTargetName | null, buildName: IosBuildName | null) {
    targetName = this.assertTargetName(targetName || null);

    return this.pbxProject?.getBuildProperty('MARKETING_VERSION', buildName ? buildName : undefined /* must use undefined if null */, targetName);
  }

  /**
   * Set the build property for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the value is set for both builds (Debug/Release);
   */
  setBuildProperty(targetName: IosTargetName | null, buildName: IosBuildName | null, key: string, value: string) {
    targetName = this.assertTargetName(targetName || null);

    this.log(`setBuildProperty`, targetName, buildName, `Setting iOS build property ${key} = ${value}`);

    this.pbxProject?.updateBuildProperty(key, pbxSerializeString(value), buildName ? buildName : undefined /* must use undefined if null */, targetName);
  }

  /**
   * Get the build property for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the value is set for both builds (Debug/Release);
   */
  getBuildProperty(targetName: IosTargetName | null, buildName: IosBuildName | null, key: string) {
    targetName = this.assertTargetName(targetName || null);

    return pbxReadString(this.pbxProject?.getBuildProperty(key, buildName ? buildName : undefined /* must use undefined if null */, targetName));
  }

  /**
   * Add a framework for the given target.
   * If the `targetName` is null the main app target is used.
   */
  addFramework(targetName: IosTargetName | null, framework: IosFramework, opts: IosFrameworkOpts = {}) {
    targetName = this.assertTargetName(targetName || null);

    const target = this.getTarget(targetName);
    this.pbxProject?.addFramework(framework, {
      target: target?.id,
      ...opts
    });
  }

  /**
   * Get the frameworks for the given target
   * If the `targetName` is null the main app target is used.
   */
  getFrameworks(targetName: IosTargetName | null): IosFramework[] {
    targetName = this.assertTargetName(targetName || null);

    const target = this.getTarget(targetName);
    if (!target) {
      return [];
    }
    return this.pbxProject?.pbxFrameworksBuildPhaseObj(target.id)?.files?.map((f: any) => f.comment.split(' ')[0]);
  }

  /**
   * Get the path to the entitlements file for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the first
   * build name is used.
   */
  getEntitlementsFile(targetName: IosTargetName | null, buildName?: IosBuildName | undefined) {
    targetName = this.assertTargetName(targetName || null);

    return this.getBuildProperty(targetName, buildName ?? null, 'CODE_SIGN_ENTITLEMENTS');
  }

  /**
   * Add entitlements for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the first
   * build name is used.
   */
  async addEntitlements(targetName: IosTargetName | null, buildName: IosBuildName | null, entitlements: IosEntitlements) {
    targetName = this.assertTargetName(targetName || null);

    let file = await this.assertEntitlementsFile(targetName, buildName);

    if (!file) {
      return;
    }

    const filename = join(this.project.config.ios!.path, file);

    const parsed = await this.plist(filename);
    parsed.update(entitlements);

    this.project.vfs.set(filename, parsed);
  }

  /**
   * Set entitlements for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the first
   * build name is used.
   */
  async setEntitlements(targetName: IosTargetName | null, buildName: IosBuildName | null, entitlements: IosEntitlements) {
    targetName = this.assertTargetName(targetName || null);

    let file = await this.assertEntitlementsFile(targetName, buildName);

    if (!file) {
      return;
    }

    const filename = join(this.project.config.ios!.path, file);

    const parsed = await this.plist(filename);
    parsed.update(entitlements, true);
    this.project.vfs.set(filename, parsed);
  }

  /**
   * Get the parsed plist of the entitlements for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the first
   * build name is used.
   */
  async getEntitlements(targetName: IosTargetName | null, buildName?: IosBuildName | undefined) {
    targetName = this.assertTargetName(targetName || null);

    const file = this.getEntitlementsFile(targetName, buildName);
    if (!file || !this.project?.config?.ios?.path) {
      return;
    }

    const filename = join(this.project.config.ios.path, file);

    const plistFile = await this.plist(filename);
    return plistFile.getDocument();
  }

  /**
   * Gets the relative Info plist file from the build settings.
   */
  async getInfoPlist(targetName: IosTargetName | null, buildName?: IosBuildName | null | undefined) {
    targetName = this.assertTargetName(targetName || null);

    return this.getBuildProperty(targetName, buildName ?? null, 'INFOPLIST_FILE');
  }

  /**
   * Gets the full relative path to the Info plist after getting the relative path
   * from the build settings and resolving it with the app path
   */
  async getInfoPlistFilename(targetName: IosTargetName, buildName?: IosBuildName | null | undefined): Promise<string | null> {
    const file = await this.getInfoPlist(targetName, buildName);
    if (!this.project?.config.ios?.path) {
      return null;
    }
    return join(this.project.config.ios.path, file);
  }

  /**
   * Set the display name for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the first
   * build name is used.
   */
  async setDisplayName(targetName: IosTargetName | null, buildName: IosBuildName | null, displayName: string) {
    targetName = this.assertTargetName(targetName || null);

    const file = await this.getInfoPlist(targetName, buildName ?? undefined);
    if (!file || !this.project?.config.ios?.path) {
      throw new Error('Unable to load plist file');
    }

    const filename = join(this.project.config.ios.path, file);

    const parsed = await this.plist(filename);
    parsed.set({ 'CFBundleDisplayName': displayName });
    this.log(`setDisplayName`, targetName, buildName, `Setting CFBundleDisplayName to ${displayName}`);
    this.project.vfs.set(filename, parsed);
  }

  /**
   * Get the display name for the given target and build.
   * If the `targetName` is null the main app target is used. If the `buildName` is null the first
   * build name is used.
   */
  async getDisplayName(targetName: IosTargetName | null, buildName?: IosBuildName | null | undefined): Promise<string | null> {
    targetName = this.assertTargetName(targetName || null);

    const filename = await this.getInfoPlistFilename(targetName, buildName);
    if (!filename) {
      return null;
    }

    const parsed = await this.plist(filename);
    const doc = parsed.getDocument() ?? {};
    return doc['CFBundleDisplayName'] as string;
  }

  /**
   * Update the Info plist for the given target and build. The entries will be merged
   * into the existing plist file.
   * 
   * Pass null as the `targetName` to use the main app target
   */
  async updateInfoPlist(targetName: IosTargetName | null, buildName: IosBuildName | null, entries: any, mergeMode?: {
    replace: boolean
  }) {
    targetName = this.assertTargetName(targetName || null);

    const filename = await this.getInfoPlistFilename(targetName, buildName ?? undefined);

    if (!filename) {
      throw new Error('Unable to get plist filename to update');
    }

    if (!await pathExists(filename)) {
      await writeFile(filename, defaultInfoPlist);
    }

    const parsed = await this.plist(filename);
    parsed.update(entries, mergeMode?.replace ?? false);
    this.project.vfs.set(filename, parsed);
  }

  async copyFile(src: string, dest: string): Promise<void> {
    if (!this.project?.config?.ios?.path) {
      return Promise.reject();
    }

    const destPath = join(this.project.config.ios.path, dest);

    if (/^(https?:\/\/)/.test(src)) {
      const res = await fetch(src);
      return writeFile(destPath, Buffer.from(await res.arrayBuffer()));
    }
    const srcPath = join(this.project.config.ios.path, src);
    return copy(srcPath, destPath);
  }

  private async assertEntitlementsFile(targetName: IosTargetName, buildName: IosBuildName | null) {
    let file = this.getEntitlementsFile(targetName, buildName ?? undefined);

    if (!file) {
      if (this.project?.config?.ios?.path) {
        const targetDir = targetName || 'App';
        const fname = `${(targetName || 'App').split(/\s+/).join('_')}.entitlements`;

        // Create the default entitlements file
        const target = join(this.project.config.ios.path, targetDir, fname)
        await writeFile(target, defaultEntitlementsPlist);

        // Always use posix paths
        file = join(targetDir, fname).split(path.sep).join(path.posix.sep);

        this.setBuildProperty(targetName, buildName, 'CODE_SIGN_ENTITLEMENTS', file);
      } else {
        return null;
      }
    }

    if (!file || !this.project?.config?.ios?.path) {
      return null;
    }

    return file;
  }

  // Used to get the target name for operations, defaulting to the main app target
  // if no targetName was provided
  private assertTargetName(targetName: string | null) {
    if (!targetName) {
      const appTargetName = this.getAppTargetName();
      if (!appTargetName) {
        throw new Error('No target supplied and unable to find the main app target');
      }
      return appTargetName;
    }

    if (!this.getTarget(targetName)) {
      throw new Error(`Target '${targetName}' not found in project`);
    }

    return targetName;
  }

  private makeTargets(proj: IosPbxProject, pbxNativeSection: any): IosTarget[] {
    return Object.keys(pbxNativeSection).filter(k => k.indexOf('_comment') < 0).map(k => {
      const n = pbxNativeSection[k];
      return {
        id: k,
        name: n.name.replace(/"/g, ''),
        productName: n.productName,
        productType: n.productType,
        buildConfigurations: this.makeBuildConfigurations(proj, n)
      }
    });
  }

  private makeBuildConfigurations(proj: IosPbxProject, pbxNativeEntry: any) {
    // const config = proj.pbxXCBuildConfigurationSection();
    const config = proj.pbxXCConfigurationList();
    const buildConfigs = proj.pbxXCBuildConfigurationSection();
    const buildConfiguration = config[pbxNativeEntry.buildConfigurationList];

    return buildConfiguration.buildConfigurations.map((bc: any) => {
      const c = buildConfigs[bc.value];

      return {
        name: c.name.replace(/"/g, ''),
        buildSettings: c.buildSettings,
      }
    });
  }

  private async plist(filename: string): Promise<PlistFile> {
    const open = this.project.vfs.get(filename);

    if (open) {
      return open.getData() as PlistFile;
    }

    const plistFile = new PlistFile(filename, this.project.vfs);

    await plistFile.load();

    return plistFile;
  }

  private iosProjectRoot() {
    return this.project?.config.ios?.path ?? '';
  }

  // Get the filename of the pbxproj
  private async pbxFilename(): Promise<string | null> {
    if (!this.project?.config.ios?.path) {
      return null;
    }

    const xcodeprojName = await this.xcodeprojName();
    const pbxprojName = await this.pbxprojName();

    return join(
      this.project.config.ios.path,
      xcodeprojName,
      pbxprojName
    )
  }

  public async xcodeprojName(): Promise<string> {
    const files = await readdir(this.iosProjectRoot());
    return files.find(f => f.indexOf('.xcodeproj') >= 0) ?? '';
  }

  public async pbxprojName(): Promise<string> {
    const xcodeprojName = await this.xcodeprojName();
    const xcodeprojDir = join(this.iosProjectRoot(), xcodeprojName);
    const files = await readdir(xcodeprojDir);
    return files.find(f => f.indexOf('.pbxproj') >= 0) ?? '';
  }

  // Parse and return a pbx project
  private async pbx() {
    const filename = await this.pbxFilename();
    if (!filename) {
      throw new Error('Unable to load pbxproj');
    }
    const pbxParsed = await parsePbxProject(filename);
    this.project.vfs.open(filename, pbxParsed, this.pbxCommitFn);
    return pbxParsed;
  }

  private pbxCommitFn = async (file: VFSFile) => {
    if (this.pbxProject) {
      await writeFile(file.getFilename(), this.pbxProject.writeSync());
    }
  }

  private plistCommitFn = async (file: VFSFile) => {
    const data = file.getData() as PlistFile;
    const xml = plist.build(data.getDocument() ?? {}, {
      indent: '	', // Tab character
      offset: -1,
      newline: '\n'
    });
    await assertParentDirs(file.getFilename());
    return writeFile(file.getFilename(), xml);
  }
}
