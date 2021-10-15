import { CapacitorProject } from "../project";

export interface IosEntitlements {
  [key: string]: any;
}

export interface IosBuildSettings {
  [key: string]: any;
}

export type IosFramework = string;

export class IosProject extends CapacitorProject {
  async setBundleId(bundleId: string) {
  }

  async setVersion(version: string) {
  }

  async getVersion() {
  }

  async setBuild(build: number) {
  }

  async getBuild() {
  }

  async incrementBuild() {
  }

  async setProductName(productName: string) {
  }

  async setDisplayName(displayName: string) {
  }

  async setEntitlements(entitlements: IosEntitlements) {
  }

  async addFramework(framework: IosFramework) {
  }

  async addFrameworks(frameworks: IosFramework[]) {
  }

  async setBuildSettings(buildSettings: IosBuildSettings) {
  }
}