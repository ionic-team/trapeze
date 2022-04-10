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
| ios      | Plist Modifications        | plist | :white_check_mark: |
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

## Android

To provide Android project operations, use the `android` platform key under the top-level `platforms` key:

```
platforms:
  android:
```

### `versionName`

Example:

```yaml
platforms:
  android:
    versionName: 5.2.1
```

### `versionCode`

```yaml
platforms:
  android:
    versionCode: 197
```

### `incrementVersionCode`

This operation will increment the integer `versionCode` each time. This is useful for auto-incrementing version codes during build, for example.

```yaml
platforms:
  android:
    incrementVersionCode: true
```

### `manifest`

The Manifest operation can modifications against the AndroidManifest XML file, and other XML files.

The operation supports three modes: `attrs`, `merge`, and `inject`:

* `attrs` updates the attributes of the given `target` node.
* `merge` merges the given XML tree supplied to `merge` with the given `target`
* `inject` injects the given XML tree supplied to `inject` inside of the given `target`

Example: 

```yaml
platforms:
  android:
    manifest:
      - file: AndroidManifest.xml
        target: manifest/application
        attrs:
          android:name: com.ionicframework.intune.IntuneApplication

      - file: AndroidManifest.xml
        target: manifest/application
        merge:
          <queries>
              <package android:name="com.azure.authenticator" />
          </queries>

      - file: AndroidManifest.xml
        target: manifest
        inject: |
          <queries>
              <package android:name="com.azure.authenticator" />
              <package android:name="$PACKAGE_NAME" />
              <package android:name="com.microsoft.windowsintune.companyportal" />
              <!-- Required for API Level 30 to make sure the app detect browsers
                  (that don't support custom tabs) -->
              <intent>
                  <action android:name="android.intent.action.VIEW" />
                  <category android:name="android.intent.category.BROWSABLE" />
                  <data android:scheme="https" />
              </intent>
              <!-- Required for API Level 30 to make sure the app can detect browsers that support custom tabs -->
              <!-- https://developers.google.com/web/updates/2020/07/custom-tabs-android-11#detecting_browsers_that_support_custom_tabs -->
              <intent>
                  <action android:name="android.support.customtabs.action.CustomTabsService" />
              </intent>
          </queries>

      - file: AndroidManifest.xml
        target: manifest/application
        inject: |
          <activity android:name="com.microsoft.identity.client.BrowserTabActivity">
              <intent-filter>
                  <action android:name="android.intent.action.VIEW" />

                  <category android:name="android.intent.category.DEFAULT" />
                  <category android:name="android.intent.category.BROWSABLE" />

                  <!--
                      Add in your scheme/host from registered redirect URI
                      note that the leading "/" is required for android:path
                  -->
                  <data
                      android:host="$PACKAGE_NAME"
                      android:path="/$INTUNE_SIGNATURE_HASH"
                      android:scheme="msauth" />
              </intent-filter>
          </activity>
```

### `gradle`

The `gradle` command can modify and insert snippets of basic Gradle code. Currently only Groovy-based Gradle files are supported ([issue and discussion](https://github.com/ionic-team/capacitor-configure/issues/58)).

The operation supports inserting arbitrary Gradle code, or when using `replace`, modifying basic method calls or variable definitions.

The Gradle commands supports two modes: `insert` or `replace`:

 * `insert` inserts new Gradle snippets at the desired location in the file
 * `replace` replaces existing entries in the Gradle file at the desired location

```yaml
platforms:
  android:
    gradle:
      - file: build.gradle
        target:
          buildscript:
        insert:
          - classpath: "'org.javassist:javassist:3.27.0-GA'"
          - classpath: files("../node_modules/@ionic-enterprise/intune/android/ms-intune-app-sdk-android/GradlePlugin/com.microsoft.intune.mam.build.jar")

      - file: build.gradle
        target:
          allprojects:
            repositories:
        insert:
          - maven:
              - url: 'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1'
              - name: 'Duo-SDK-Feed'

      - file: app/build.gradle
        target:
        insert: |
          apply plugin: 'com.microsoft.intune.mam'
          intunemam {
            includeExternalLibraries = ["androidx.*", "com.getcapacitor.*"]
          }

      - file: app/build.gradle
        target:
          android:
            buildTypes:
              release:
                minifyEnabled:
        replace:
          minifyEnabled: true

      - file: app/build.gradle
        target:
          android:
            buildTypes:
              implementation:
        replace:
          implementation: "'test-implementation'"
```

### `packageName`

### `res`

## iOS

iOS supports multiple operations and can perform them against different project targets and build types. If a target and/or build is not specified, the tool will infer the app target in the project. Thus, complex projects should specify the target to avoid issues.

```yaml
platforms:
  ios:
    targets:
      App:
        # Operations for the App target
      My App Clip:
        # Oeprations for the My App Clip target
```


### `version`

Updates the human-readable version for the given target and build:

```yaml
platforms:
  ios:
    

### `buildNumber`
### `incrementBuild`
### `bundleId`
### `displayName`
### `productName`
### `buildSettings`
### `plist`
### `entitlements`