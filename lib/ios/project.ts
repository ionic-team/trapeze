import plist from 'plist';
import { join } from 'path';
import { parsePbxProject } from "../util/pbx";
import { parsePlist } from "../util/plist";
import { Change } from "../change";
import { CapacitorProject } from "../project";
import { IosPbxProject, IosEntitlements, IosFramework, IosProjectName, IosBuildName, IosTarget, IosTargetName, IosTargetBuildConfiguration } from '../definitions';

export class IosProject {
  private pbxProject: IosPbxProject;

  constructor(private project: CapacitorProject) {
  }

  async load() {
    const proj = await this.pbx();

    this.pbxProject = proj;

    const targets = proj.pbxNativeTargetSection();
  }

  getPbxProject() {
    return this.pbxProject;
  }

  getTargets(): IosTarget[] {
    const pbxNative = this.pbxProject.pbxNativeTargetSection();

    return this.makeTargets(this.pbxProject, pbxNative);
  }

  getTarget(name: string): IosTarget | null {
    return this.getTargets().find(t => t.name === name);
  }

  getBundleId(targetName: IosTargetName, buildName: string): string | null {
    return this.getTarget(targetName)?.buildConfigurations.find(c => c.name === buildName)?.buildSettings?.['PRODUCT_BUNDLE_IDENTIFIER'];
  }

  setBundleId(targetName: IosTargetName, buildName: IosBuildName, bundleId: string) {
    this.pbxProject?.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', bundleId, buildName, targetName);
  }

  getBuildConfigurations(targetName: IosTargetName): IosTargetBuildConfiguration[] {
    return this.getTarget(targetName)?.buildConfigurations ?? [];
  }

  setProductName(targetName: IosTargetName, productName: string) {
    this.pbxProject?.updateBuildProperty('PRODUCT_NAME', productName, null, targetName);
  }

  getProductName(targetName: IosTargetName): string | null {
    return this.getTarget(targetName)?.productName;
  }


  setBuild(targetName: IosTargetName, buildName: IosBuildName, buildNumber: number) {
    this.pbxProject?.updateBuildProperty('CURRENT_PROJECT_VERSION', buildNumber, buildName, targetName);
  }

  getBuild(targetName: IosTargetName, buildName: IosBuildName) {
    return this.pbxProject?.getBuildProperty('CURRENT_PROJECT_VERSION', buildName, targetName);
  }

  /**
   * Increment the build number for the given build name. If the build
   * name is not specified, both Debug and Release builds are incremented.
   */
  incrementBuild(targetName: IosTargetName, buildName: IosBuildName) {
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

  setBuildProperty(targetName: IosTargetName, buildName: IosBuildName, key: string, value: string) {
    this.pbxProject?.updateBuildProperty(key, value, buildName, targetName);
  }

  getBuildProperty(targetName: IosTargetName, buildName: IosBuildName, key: string) {
    return this.pbxProject?.getBuildProperty(key, buildName, targetName);
  }

  private makeTargets(proj: IosPbxProject, pbxNativeSection: any): IosTarget[] {
    return Object.keys(pbxNativeSection).filter(k => k.indexOf('_comment') < 0).map(k => {
      const n = pbxNativeSection[k];
      return {
        id: k,
        name: n.name,
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
        name: c.name,
        buildSettings: c.buildSettings,
      }
    });
  }


  /*
  async setBundleId(bundleId: string, targetName: IosTargetName = null) {
    const proj = await this.pbx();

    let target = targetName ? proj.pbxTargetByName(targetName) : proj.getFirstTarget();

    if (!target) {
      throw new Error(`No native target found with the name ${targetName}`);
    }

    proj.updateBuildProperty(
      'PRODUCT_BUNDLE_IDENTIFIER',
      bundleId,
      null,
      target.name,
    );

    return this.pbxChange(proj);
  }
  */

  async setDisplayName(displayName: string, projectName: IosProjectName = null) {
    const parsed = await this.plist(projectName);
    plist['CFBundleDisplayName'] = displayName;

    return this.plistChange(parsed, projectName);
  }


  // TODO: Support project name
  private plistFilename(projectName = null) {
    return join(this.project.config.ios.path, 'App', 'App', 'Info.plist');
  }

  private async plist(projectName = null) {
    const filename = this.plistFilename(projectName);
    return parsePlist(filename);
  }

  // Create a change to write the project pbx file
  private plistChange = (parsedPlist: any, projectName: IosProjectName = null) => new Change({
    file: this.plistFilename(projectName),
    data: plist.build(parsedPlist)
  }, Change.WriteFileChangeCommitStrategy)

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
  private pbx() {
    return parsePbxProject(this.pbxFilename());
  }

  // Create a change to write the project pbx file
  private pbxChange = (proj: IosPbxProject) => new Change({
    file: this.pbxFilename(),
    data: proj.writeSync()
  }, Change.WriteFileChangeCommitStrategy)
}