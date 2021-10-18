/**
 * ios definitions
 */
export interface IosPbxProject {
  writeSync: () => string;

  [key: string]: any;
}

export interface IosEntitlements {
  [key: string]: any;
}

export interface IosBuildSettings {
  [key: string]: any;
}

export interface IosTarget {
  buildConfigurations: IosTargetBuildConfiguration[];
  [key: string]: any;
}

export interface IosTargetBuildConfiguration {
  name: string;
  buildSettings: IosBuildSettings;
}

export type IosFramework = string;

export type IosBuildName = 'Debug' | 'Release' | string;

export type IosTargetName = string;
export type IosProjectName = string;
