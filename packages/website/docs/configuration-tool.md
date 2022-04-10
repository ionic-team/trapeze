---
title: Configuration Tool
sidebar_label: Configuration Tool
---

To configure projects using configuration and the configuration tool, install the `@capacitor/configure` package. This package uses the `@capacitor/project` API under the hood:

```bash
npm install @capacitor/configure
```

Add to your npm scripts:

```json
"scripts": {
  "cap-config": "cap-config"
}
```

## Usage

```bash
npm run cap-config run config.yaml
```

## Writing Configuration Files

Configuration files are written in YAML. New to YAML? Read [Learn YAML in five minutes](https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes).

See an [Example Yaml Configuration](https://github.com/ionic-team/capacitor-configure/blob/main/examples/basic.yml) for a real-world example using many of the supported features.

## Variables and Environment Variables

Variables defined in the yaml `vars` section can be automatically supplied through environment variables of the same name, or interactively input by the user if not found in the environment and lacking a default value.

For example:

```yaml
vars:
  MY_APP_ID:
  THIS_HAS_A_DEFAULT:
    default: true
```

In this case, `MY_APP_ID` has no default value, so `MY_APP_ID` must be found in the environment or an interactive prompt will display asking the user to input a value. `THIS_HAS_A_DEFAULT` will use the default value of `true` unless a value is provided in the environment.

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

## Thank you's

Thank you to Cordova for the lower-level [cordova-node-xcode](https://github.com/apache/cordova-node-xcode) project used to parse and manage the `pbxproj` file in Xcode projects.