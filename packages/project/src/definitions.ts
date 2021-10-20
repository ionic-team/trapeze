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
  id: string;
  name: string;
  productName: string;
  productType: string;
  buildConfigurations: IosTargetBuildConfiguration[];
  [key: string]: any;
}

export interface IosTargetBuildConfiguration {
  name: string;
  buildSettings: IosBuildSettings;
}

export type IosFramework = string;

export interface IosFrameworkOpts {
  customFramework?: boolean;
  /**
   * Default: true
   */
  link?: boolean;
  /**
   * Whether to embed the framework. Default: false
   */
  embed?: boolean;
}

export type IosBuildName = 'Debug' | 'Release' | string;

export type IosTargetName = string;
export type IosProjectName = string;

/**
 * Android definitions
 */

export type AndroidResDir = 'anim' | 'animator' | 'color' | 'drawable' | 'font' | 'interpolator' | 'layout' | 'menu' | 'mipmap' | 'navigation' | 'raw' | 'transition' | 'values' | 'xml' | string;