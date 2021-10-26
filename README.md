# Capacitor Project API and Configuration Tool

This project has two utilities for automatically configuring native [Capacitor](https://capacitorjs.com/) projects in a predictable and safe way.

The first is the Project API which provides a fully-typed JavaScript API for writing custom project configuration scripts and modifying underlying iOS and Android configuration, build, and project files.

The second is a tool for configuration-based modifications which is useful for plugins and other scripts that need to apply certain settings to a file in a way that fits the configuration approach.

**Note:** This project is currently in active development and does not have an official first release (As of October '21). I'm currently collecting feedback on the different use cases you need a configuration tool for here: https://github.com/ionic-team/capacitor-configure/issues/1

# Project API

To write custom scripts and code that manage iOS and Android targets in your Capacitor project, install the `@capacitor/project` package:

```bash
npm install @capacitor/project
```

### API Usage

Note: `JAVA_HOME` must be set to use Gradle configuration.

To initialize the project, set the config and initialize a new `CapacitorProject` instance:

```typescript
import { CapacitorProject } from '@capacitor/project';
import { CapacitorConfig } from '@capacitor/cli';

// This takes a CapacitorConfig, such as the one in capacitor.config.ts, but only needs a few properties
// to know where the ios and android projects are
const config: CapacitorConfig = {
  ios: {
    path: 'ios',
  },
  android: {
    path: 'android',
  },
};

const project = new CapacitorProject(config);
await project.load();
```

Once the project is loaded, iOS and Android operations can be performed on the project, as shown below:

## iOS

iOS Supports multiple targets and build names (i.e. `Debug` or `Release`).

### Targets

For apps that use multiple targets, such as an App Clip or Watch app, operations on the project can be isolated to specific targets and also build names (`Debug` or `Release`). However, most methods allow you to pass `null` as the `targetName` which will then default to using the main App target in the app, which is useful for apps that only have one main App target.

Additionally, `buildName` can be set to `null` in all methods or, if it's the last argument, left out entirely, however the behavior here is less well defined. Sometimes this uses the first build (such as `Debug` or `Release`), and sometimes it uses both. Documentation on which scenarios occur when is forthcoming.

To get the Targets in the app, use:

```typescript
// Get all targets in the project
project.ios.getTargets();
// Targets have properties like id, name, productName, productType, and a list of buildConfigurations

// Get the main app target in the project
const appTarget = project.ios.getAppTarget();
```

### Project Settings

#### Bundle ID

```typescript
// Get the bundle id for the given target, pass the build name as an optional second parameter
project.ios.getBundleId(appTarget.name);
project.ios.setBundleId(targetName, buildName, 'io.ionic.betterBundleId');
project.ios.setBundleId(targetName, null, 'io.ionic.betterBundleId');
```

#### Version and Build Number

The version and build number can be managed, including incrementing the build number which is useful for automated builds:

```typescript
// Get the numeric build number (aka CURRENT_PROJECT_VERSION) for the given target and build name
project.ios.getBuild(targetName, buildName);
// Get the version name (aka the MARKETING_VERSION)
project.ios.getVersion(targetName, buildName);

// Set the numeric build number
project.ios.setBuild(targetName, buildName, 42);
// Increment the build number
project.ios.incrementBuild(targetName, buildName);
// Set the marketing version
project.ios.setVersion(targetName, buildName, '1.2.3');
```

#### Display Name

The display name can be managed:

```typescript
project.ios.getDisplayName(targetName, buildName);
project.ios.setDisplayName(targetName, buildName, 'Really Awesome App');
```

#### Info.plist

Modifications to the `Info.plist` for the given target and build can be made by passing in an object corresponding to entries in the plist.

Note: this method will use the registered `INFOPLIST_FILE` for the given target and build so make sure that is set correctly if you've renamed the `Info.plist` file.

```typescript
await project.ios.updateInfoPlist(targetName, buildName, {
  NSFaceIDUsageDescription: 'The better to see you with',
});
```

#### Frameworks

Frameworks, Libraries, and Embedded Content can be managed:

```typescript
project.ios.addFramework(targetName, 'ImageIO.framework');

// Complex framework setups can pass options. Boolean fields supported:
// embed, link, customFramework
project.ios.addFramework(targetName, 'Custom.framework', {
  embed: true,
});
project.ios.getFrameworks(targetName);
```

#### Entitlements

Entitlements can be managed:

```typescript
// The key for the key/value entries should be the low-level entitlement key,
// which can be found on the Apple docs: https://developer.apple.com/documentation/bundleresources/entitlements?language=objc
await project.ios.addEntitlements(targetName, buildName, {
  'keychain-access-groups': ['group1', 'group2'],
});
await project.ios.getEntitlements(targetName);
```

#### Build Configurations

Build settings for targets and specific builds can be managed:

```typescript
// Configurations will be an array of object with fields name and buildSettings which is an object
// containing all build varibles for the build in the target, such as compiler options like
// ENABLE_BITCODE
project.ios.getBuildConfigurations(target);

// Individual build properties can be read or written:
project.ios.setBuildProperty(targetName, buildName, 'FAKE_PROPERTY', 'YES');
expect(
  project.ios.getBuildProperty(targetName, buildName, 'FAKE_PROPERTY'),
).toBe('YES');
```

## Android

More soon

# Configuration Tool

To configure projects using configuration and the configuration tool, install the `@capacitor/configure` package. This package uses the `@capacitor/project` API under the hood:

```bash
npm install @capacitor/configure
```

Add to your npm scripts:

## Usage

```bash
npx cap-config run config.yaml
```

## Writing Configuration Files

Configuration files are written in YAML. New to YAML? Read [Learn YAML in five minutes](https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes).

See an [Example Yaml Configuration](https://github.com/ionic-team/capacitor-configure/blob/main/examples/basic.yml) for a real-world example using many of the supported features.

## Supported Operations

| Platform | Operation                  | Supported          |
| -------- | -------------------------- | ------------------ |
| ios      | Bundle ID and Product Name | :white_check_mark: |
| ios      | Version and Build Number   | :white_check_mark: |
| ios      | Increment Build Number     | :white_check_mark: |
| ios      | Build Settings             | :white_check_mark: |
| ios      | Plist Modifications        | :white_check_mark: |
| ios      | Add Frameworks             | :white_check_mark: |
| ios      | Set Entitlements           | :white_check_mark: |
| ios      | Add Source/Header files    | WIP                |
| android  | Package Name               | :white_check_mark: |
| android  | Version Name and Code      | :white_check_mark: |
| android  | Version Code               | :white_check_mark: |
| android  | Increment Version Code     | :white_check_mark: |
| android  | Gradle Config              | :white_check_mark: |
| android  | Resource Files             | :white_check_mark: |
| android  | Manifest File Modification | :white_check_mark: |
| android  | Add Source/Header files    | WIP                |

## Thank yous

Thank you to Cordova for the lower-level [corodva-node-xcode](https://github.com/apache/cordova-node-xcode) project used to parse and manage the `pbxproj` file in Xcode projects.
