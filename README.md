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
    path: 'ios'
  },
  android: {
    path: 'android'
  }
};

const project = new CapacitorProject(config);
await project.load();
```

Once the project is loaded, iOS and Android operations can be performed on the project, as shown below:

## iOS

iOS Supports multiple targets and build names (i.e. `Debug` or `Release`). 

### Targets

For apps that use multiple targets, such as an App Clip or Watch app, operations on the project can be isolated to specific targets and also build names (`Debug` or `Release`). However, most methods allow you to pass `null` as the `targetName` which will then default to using the main App target in the app, which is useful for apps that only have one main App target.

To get the Targets in the app, use:

```typescript
// Get all targets in the project
project.ios.getTargets();
// Targets have properties like id, name, productName, productType, and a list of buildConfigurations

// Get the main app target in the project
const appTarget = project.ios.getAppTarget();
```

### Project Settings

```typescript
// Get the bundle id for the given target, pass the build name as an optional second parameter
project.ios.getBundleId(appTarget.name);
project.ios.setBundleId('App', 'Debug', 'io.ionic.betterBundleId');
project.ios.setBundleId('App', null, 'io.ionic.betterBundleId');
```

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
