import plist from 'plist';
import { join } from 'path';
import { parsePbxProject } from "../util/pbx";
import { parsePlist } from "../util/plist";
import { Change } from "../change";
import { CapacitorProject } from "../project";

export interface IosEntitlements {
  [key: string]: any;
}

export interface IosBuildSettings {
  [key: string]: any;
}

export type IosFramework = string;

export type IosBuildName = 'Debug' | 'Release' | string;

export type IosTargetName = string;
export type IosProjectName = string;

export interface PbxProject {
  writeSync: () => string;
  [key: string]: any;
}

export class IosProject {
  constructor(private project: CapacitorProject) {
  }

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

  async setProductName(productName: string) {
    const proj = await this.pbx();
    proj.updateProductName(productName);

    return this.pbxChange(proj);
  }

  async setDisplayName(displayName: string, projectName: IosProjectName = null) {
    const parsed = await this.plist(projectName);
    plist['CFBundleDisplayName'] = displayName;

    return this.plistChange(parsed, projectName);
  }

  /**
   * Set the version for the given build (Debug/Release/etc)
   */
  async setVersion(version: string, build: IosBuildName) {
    const proj = await this.pbx();
    proj.addBuildProperty('MARKETING_VERSION', version, build);

    return this.pbxChange(proj);
  }

  async getVersion(build: IosBuildName, proj: PbxProject = null) {
    if (!proj) {
      proj = await this.pbx();
    }

    return proj.getBuildProperty('CURRENT_PROJECT_VERSION', build);
  }

  async setBuild(buildNumber: number, buildName: IosBuildName) {
    const proj = await this.pbx();
    proj.addBuildProperty('CURRENT_PROJECT_VERSION', buildNumber, buildName);

    return this.pbxChange(proj);
  }

  async getBuild(build: IosBuildName, proj: PbxProject = null) {
    if (!proj) {
      proj = await this.pbx();
    }

    return proj.getBuildProperty('CURRENT_PROJECT_VERSION', build);
  }

  /**
   * Increment the build number for the given build name. If the build
   * name is not specified, both Debug and Release builds are incremented.
   */
  async incrementBuild(build: IosBuildName) {
    const proj = await this.pbx();

    const num = await this.getBuild(build, proj);

    if (num) {
      proj.addBuildProperty('CURRENT_PROJECT_VERSION', num + 1, build);
    } else {
      proj.addBuildProperty('CURRENT_PROJECT_VERSION', 1, build);
    }

    return this.pbxChange(proj);
  }
  async setEntitlements(entitlements: IosEntitlements) {
  }

  async addFramework(framework: IosFramework) {
  }

  async addFrameworks(frameworks: IosFramework[]) {
  }

  async setBuildProperty(key: string, value: string, buildName: IosBuildName) {
    const proj = await this.pbx();
    proj.addBuildProperty(key, value, buildName);

    return this.pbxChange(proj);
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
  private pbxChange = (proj: PbxProject) => new Change({
    file: this.pbxFilename(),
    data: proj.writeSync()
  }, Change.WriteFileChangeCommitStrategy)
}