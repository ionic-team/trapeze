import plist from 'plist';
import { join } from 'path';
import { writeFile } from '@ionic/utils-fs';

import { parsePbxProject } from "../util/pbx";
import { parsePlist, updatePlist } from "../util/plist";
import { CapacitorProject } from "../project";
import { IosPbxProject, IosEntitlements, IosFramework, IosProjectName, IosBuildName, IosTarget, IosTargetName, IosTargetBuildConfiguration, IosFrameworkOpts } from '../definitions';
import { VFSRef } from '../vfs';

const defaultEntitlementsPlist = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
</dict>
</plist>
`;


export class IosProject {
  private pbxProject: IosPbxProject;

  constructor(private project: CapacitorProject) {
  }

  async load() {
    const proj = await this.pbx();

    this.pbxProject = proj;
  }

  getPbxProject() {
    return this.pbxProject;
  }

  /**
   * Get all targets in the project
   */
  getTargets(): IosTarget[] {
    const pbxNative = this.pbxProject.pbxNativeTargetSection();

    return this.makeTargets(this.pbxProject, pbxNative);
  }

  /**
   * Get the target with the given name
   */
  getTarget(name: string): IosTarget | null {
    return this.getTargets().find(t => t.name === name || t.name === `\"${name}\"`);
  }

  /**
   * Get the main app target in the project.
   */
  getAppTarget(): IosTarget | null {
    return this.getTargets().find(t => t.productType === '"com.apple.product-type.application"');
  }

  getBundleId(targetName: IosTargetName, buildName?: string): string | null {
    if (buildName) {
      return this.getTarget(targetName)?.buildConfigurations.find(c => c.name === buildName)?.buildSettings?.['PRODUCT_BUNDLE_IDENTIFIER'];
    }

    return this.getTarget(targetName)?.buildConfigurations[0]?.buildSettings?.['PRODUCT_BUNDLE_IDENTIFIER'];
  }

  setBundleId(targetName: IosTargetName, buildName: IosBuildName | null, bundleId: string) {
    this.pbxProject?.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', bundleId, buildName, targetName);
  }

  /**
   * Get the build configurations for a given target.
   */
  getBuildConfigurations(targetName: IosTargetName): IosTargetBuildConfiguration[] {
    return this.getTarget(targetName)?.buildConfigurations ?? [];
  }

  /**
   * Get the build configuration names (ex: Debug, Release) for a given target.
   */
  getBuildConfigurationNames(targetName: IosTargetName): string[] {
    return this.getBuildConfigurations(targetName).map(c => c.name);
  }

  setProductName(targetName: IosTargetName, productName: string) {
    this.pbxProject?.updateBuildProperty('PRODUCT_NAME', productName, null, targetName);
  }

  getProductName(targetName: IosTargetName): string | null {
    return this.getTarget(targetName)?.productName;
  }


  setBuild(targetName: IosTargetName, buildName: IosBuildName | null, buildNumber: number) {
    this.pbxProject?.updateBuildProperty('CURRENT_PROJECT_VERSION', buildNumber, buildName, targetName);
  }

  getBuild(targetName: IosTargetName, buildName?: IosBuildName | undefined) {
    return this.pbxProject?.getBuildProperty('CURRENT_PROJECT_VERSION', buildName, targetName);
  }

  /**
   * Increment the build number for the given build name. If the build
   * name is not specified, both Debug and Release builds are incremented.
   */
  incrementBuild(targetName: IosTargetName, buildName?: IosBuildName | undefined) {
    const num = this.getBuild(targetName, buildName);

    if (num) {
      this.setBuild(targetName, buildName, num + 1);
    } else {
      this.setBuild(targetName, buildName, 1);
    }
  }

  /**
   * Set the version for the given build (Debug/Release/etc)
   */
  setVersion(targetName: IosTargetName, buildName: IosBuildName, version: string) {
    this.pbxProject?.updateBuildProperty('MARKETING_VERSION', version, buildName, targetName);
  }

  getVersion(targetName: IosTargetName, buildName: IosBuildName) {
    return this.pbxProject?.getBuildProperty('CURRENT_PROJECT_VERSION', buildName, targetName);
  }

  setBuildProperty(targetName: IosTargetName, buildName: IosBuildName | null, key: string, value: string) {
    this.pbxProject?.updateBuildProperty(key, value, buildName ? buildName : undefined /* must use undefined if null */, targetName);
  }

  getBuildProperty(targetName: IosTargetName, buildName: IosBuildName | null, key: string) {
    return this.pbxProject?.getBuildProperty(key, buildName ? buildName : undefined /* must use undefined if null */, targetName)?.replace(/(^")+|("$)+/g, '');
  }

  addFramework(targetName: IosTargetName, framework: IosFramework, opts: IosFrameworkOpts = {}) {
    const target = this.getTarget(targetName);
    this.pbxProject?.addFramework(framework, {
      target: target?.id,
      ...opts
    });
  }

  getFrameworks(targetName: IosTargetName): IosFramework[] {
    const target = this.getTarget(targetName);
    if (!target) {
      return [];
    }
    return this.pbxProject?.pbxFrameworksBuildPhaseObj(target.id)?.files?.map(f => f.comment.split(' ')[0]);
  }

  getEntitlementsFile(targetName: IosTargetName, buildName: IosBuildName) {
    return this.getBuildProperty(targetName, buildName, 'CODE_SIGN_ENTITLEMENTS');
  }

  async addEntitlements(targetName: IosTargetName, buildName: IosBuildName, entitlements: IosEntitlements) {
    const file = this.getEntitlementsFile(targetName, buildName);
    if (!file) {
      return;
    }

    const filename = join(this.project.config.ios.path, 'App', file);

    const parsed = await this.plist(filename);
    const updated = updatePlist(entitlements, parsed);
    this.project.vfs.set(filename, updated);
  }

  async getEntitlements(targetName: IosTargetName, buildName?: IosBuildName | undefined) {
    const file = this.getEntitlementsFile(targetName, buildName);
    if (!file) {
      return;
    }

    const filename = join(this.project.config.ios.path, 'App', file);

    return this.plist(filename);
  }

  /**
   * Gets the relative Info plist file from the build settings.
   */
  getInfoPlist(targetName: IosTargetName, buildName?: IosBuildName | undefined) {
    return this.getBuildProperty(targetName, buildName, 'INFOPLIST_FILE');
  }

  /**
   * Gets the full relative path to the Info plist after getting the relative path
   * from the build settings and resolving it with the app path
   */
  getInfoPlistFilename(targetName: IosTargetName, buildName?: IosBuildName | undefined) {
    const file = this.getInfoPlist(targetName, buildName);
    // TODO: Don't hardcode the 'App' folder
    return join(this.project.config.ios.path, 'App', file);
  }

  async setDisplayName(targetName: IosTargetName, buildName: IosBuildName | null, displayName: string) {
    const file = this.getInfoPlist(targetName, buildName);
    const filename = join(this.project.config.ios.path, 'App', file);

    const parsed = await this.plist(filename);
    parsed['CFBundleDisplayName'] = displayName;
  }

  async getDisplayName(targetName: IosTargetName, buildName?: IosBuildName | undefined) {
    const filename = this.getInfoPlistFilename(targetName, buildName);

    const parsed = await this.plist(filename);
    return parsed['CFBundleDisplayName'];
  }

  /**
   * Update the Info plist for the given target and build. The entries will be merged
   * into the existing plist file
   */
  async updateInfoPlist(targetName: IosTargetName, buildName: IosBuildName | null, entries: any) {
    const filename = this.getInfoPlistFilename(targetName, buildName);

    const parsed = await this.plist(filename);
    const updated = updatePlist(entries, parsed);
    this.project.vfs.set(filename, updated);
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

    return buildConfiguration.buildConfigurations.map(bc => {
      const c = buildConfigs[bc.value];

      return {
        name: c.name.replace(/"/g, ''),
        buildSettings: c.buildSettings,
      }
    });
  }

  private async plist(filename) {
    const open = this.project.vfs.get(filename);

    if (open) {
      return open.getData();
    }
    const parsed = await parsePlist(filename);
    this.project.vfs.open(filename, parsed, this.plistCommitFn);
    return parsed;
  }

  // Get the filename of the pbxproj
  private pbxFilename() {
    return join(
      this.project.config.ios.path,
      'App',
      'App.xcodeproj',
      'project.pbxproj',
    )
  }

  // Parse and return a pbx project
  private async pbx() {
    const pbxParsed = await parsePbxProject(this.pbxFilename());
    this.project.vfs.open(this.pbxFilename(), pbxParsed, this.pbxCommitFn);
    return pbxParsed;
  }

  private pbxCommitFn = async (file: VFSRef) => {
    this.pbxProject?.writeSync();
  }

  private plistCommitFn = async (file: VFSRef) => {
    const data = file.getData();
    const xml = plist.build(data);
    return writeFile(file.getFilename(), xml);
  }
}