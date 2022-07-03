---
title: Configuration Tool
sidebar_position: 3
sidebar_label: Configuration Tool
---

To configure projects using configuration and the configuration tool, install the `@trapezedev/configure` package. This package uses the `@trapezedev/project` API under the hood:

```bash
npm install @trapezedev/configure
```

## Usage

Then, assuming you have a Trapeze YAML configuration file to use, use the `run` command to process it.

```bash
npx trapeze run config.yaml --android-project android --ios-project ios/App
```

Where `--android-project` is the relative path to your Android project, and `--ios-project` is the relative path to your iOS Xcode project folder.

Here's a basic example YAML file:

```yaml title="config.yaml"
platforms:
  android:
    versionName: 5.2.1
  ios:
    version: 16.4
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

Here's one example of providing an environment variable to the command:

```shell
MY_APP_ID="com.awesome.app" npx trapeze
```

## Android

To provide Android project operations, use the `android` platform key under the top-level `platforms` key:

```yaml
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

### `packageName`

Set the project package name. This operation will also rename the actual java package and folder structure to match. Currently, these modifications happen without confirmation when the tool is run. See [this discussion](https://github.com/ionic-team/capacitor-configure/issues/28) for more info.

```yaml
platforms:
  android:
    packageName: $PACKAGE_NAME
```

### `manifest`

The Manifest operation can modifications against the AndroidManifest XML file, and other XML files.

The operation supports three modes: `attrs`, `merge`, and `inject`:

- `attrs` updates the attributes of the given `target` node.
- `merge` merges the given XML tree supplied to `merge` with the given `target`
- `inject` injects the given XML tree supplied to `inject` inside of the given `target`
- `delete` deletes nodes specified by `delete` in XPath format.
- `deleteAttributes` deletes the given attributes in `deleteAttributes` inside of the given `target`

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
        merge: <queries>
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

      - file: AndroidManifest.xml
        delete: //intent-filter

      - file: AndroidManifest.xml
        target: manifest/application/application
        deleteAttributes:
          - android:name
```

### `gradle`

The `gradle` command can modify and insert snippets of basic Gradle code. Currently only Groovy-based Gradle files are supported ([issue and discussion](https://github.com/ionic-team/capacitor-configure/issues/58)).

The operation supports inserting arbitrary Gradle code, or when using `replace`, modifying basic method calls or variable definitions.

The Gradle commands supports two modes: `insert` or `replace`:

- `insert` inserts new Gradle snippets at the desired location in the file
- `replace` replaces existing entries in the Gradle file at the desired location

Currently, the tool supports updating primitive types (numbers, strings, booleans), and arrays of primitives. Strings need additional quoting if necessary, in order to support non-quoted variable strings. See the example below for string quoting examples.

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

### `res`

Creates new resource files. Use `path` to specify the resource type.

```yaml
platforms:
  android:
    res:
      - path: raw
        file: auth_config.json
        text: |
          {
            "client_id": "$INTUNE_CLIENT_ID",
            "authorization_user_agent": "DEFAULT",
            "redirect_uri": "msauth://$PACKAGE_NAME/$HASH",
            "broker_redirect_uri_registered": true,
            "authorities": [
              {
                "type": "AAD",
                "audience": {
                  "type": "AzureADMyOrg",
                  "tenant_id": "$INTUNE_TENANT_ID"
                }
              }
            ]
          }
```

### `json`

Modifies JSON files relative to the root of the Android project. Use `set` to override the element (and clobber any children), or `merge` to merge the values:

```yaml
platforms:
  android:
    json:
      - file: google-services.json
        set:
          project_info:
            project_id: "MY_ID"
      - file: google-services.json
        merge:
          data:
            field: "MY_FIELD"
```

### `xml`

Modifies XML files relative to the root of the Android project. Can also modify files relative to the resource path using `resFile` instead of `file`. This operation supports the same options as the `manifest` operation:

- `attrs` updates the attributes of the given `target` node.
- `merge` merges the given XML tree supplied to `merge` with the given `target`
- `inject` injects the given XML tree supplied to `inject` inside of the given `target`
- `delete` deletes nodes specified by `delete` in XPath format.
- `deleteAttributes` deletes the given attributes in `deleteAttributes` inside of the given `target`

```yaml
platforms:
  android:
    xml:
      - file: app/file.xml
        target: entries/field
        merge: |
          <string>Value</string>
      - resFile: values/strings.xml
        target: resources/string[@name="app_name"]
        replace: |
          <string name="app_name">Awesome App</string>
```

## iOS

iOS supports multiple operations and can perform them against different project targets and build types. If a target is not specified, the tool will infer the app target in the project. If a build is not specified commands will operate on all builds in a target (Debug and Release, for example). Thus, complex projects should specify at least the target name to avoid issues.

Here's an example of not supplying the target name and having it inferred by finding the first target with the productType of `"com.apple.product-type.application"`:

```yaml
platforms:
  ios:
    # Operations for the main app target
```

Here's an example of specifying the target:

```yaml
platforms:
  ios:
    targets:
      App:
        # Operations for the App target
      My App Clip:
        # Operations for the My App Clip target
```

In this example, both a target and build type are provided:

```yaml
platforms:
  ios:
    targets:
      App:
        builds:
          Debug:
            # Operations for the App target and Debug build
          Release:
            # Operations for the App target and Release build
```

### `version`

Updates the human-readable version for the given target and build:

```yaml
platforms:
  ios:
    targets:
      App:
        version: 16.4
```

### `buildNumber`

Sets the integer build number for the given target and build:

```yaml
platforms:
  ios:
    targets:
      App:
        buildNumber: 128
```

### `incrementBuild`

Increments the build number for the given target and build:

```yaml
platforms:
  ios:
    targets:
      App:
        incrementBuildNumber: true
```

### `bundleId`

Sets the bundle id for the given target and build:

```yaml
platforms:
  ios:
    targets:
      App:
        bundleId: $BUNDLE_ID
```

### `displayName`

Sets the display name for the given target and build:

```yaml
platforms:
  ios:
    targets:
      App:
        displayName: My Awesome App
```

### `productName`

Sets the product name for the given target and build. This sets the `PRODUCT_NAME` field in your project build settings for this target and build.

```yaml
platforms:
  ios:
    targets:
      App:
        productName: Awesome App
```

### `buildSettings`

Sets build settings fields for this target and build.

```yaml
platforms:
  ios:
    targets:
      App:
        buildSettings:
          ENABLE_BITCODE: false
          STRIP_SWIFT_SYMBOLS: false
```

### `plist`

Updates values in the `INFOPLIST_FILE` for the given target and build. Currently only supports updating this file but support for other plist files is [coming](https://github.com/ionic-team/capacitor-configure/issues/52).

```yaml
platforms:
  ios:
    targets:
      App:
        plist:
          - replace: true
            entries:
              - UISupportedInterfaceOrientations:
                  - UIInterfaceOrientationPortrait

          - replace: false
            entries:
              - CFBundleURLTypes:
                  - CFBundleURLSchemes:
                      - AdditionalBundleURLScheme
```

### `entitlements`

Updates the entitlements for a given target and build:

```yaml
platforms:
  ios:
    targets:
      App:
        entitlements:
          - keychain-access-groups: ['$BUNDLE_ID', 'com.microsoft.intune.mam', 'com.microsoft.adalcache']
```

### `json`

Modifies JSON files relative to the root of the iOS project. Use `set` to override the element (and clobber any children), or `merge` to merge the values:

```yaml
platforms:
  ios:
    targets:
      App:
        json:
          - file: google-services.json
            set:
              project_info:
                project_id: "MY_ID"
          - file: google-services.json
            merge:
              data:
                field: "MY_FIELD"
```
