---
title: Android Operations
sidebar_position: 3
sidebar_label: Android
---

## Android

To provide Android project operations using the [Configuration Tool](./getting-started), use the `android` platform key under the top-level `platforms` key:

```yaml
platforms:
  android:
```

### `appName`

Updates the app display name by setting either the `<application android:label` attribute in the `AndroidManifest.xml`, or setting the `strings` resource value entry when using a resource value reference in the manifest.

```yaml
platforms:
  android:
    appName: Great App Name
```

### `versionName`

Update the `versionName` in `android { defaultConfig {} }` in `app/build.gradle`. To target a different `versionName`, use the generic [gradle](#gradle) operation.

Example:

```yaml
platforms:
  android:
    versionName: 5.2.1
```

### `versionCode`

Update the `versionCode` in `android { defaultConfig {} }` in `app/build.gradle`. To target a different `versionCode`, use the generic [gradle](#gradle) operation.

```yaml
platforms:
  android:
    versionCode: 197
```

### `incrementVersionCode`

This operation will increment the integer `versionCode` in `android { defaultConfig {} }` in `app/build.gradle`. This is useful for auto-incrementing version codes during build, for example.

To target a different `versionCode`, use the generic [gradle](#gradle) operation.

```yaml
platforms:
  android:
    incrementVersionCode: true
```

### `versionNameSuffix`

Since: 6.0.11

Set the `versionNameSuffix` in `android { defaultConfig {} }`.  To target a different `versionNameSuffix`, use the generic [gradle](#gradle) operation.

Example:

```yaml
platforms:
  android:
    versionNameSuffix: "beta"
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
- `merge` merges the given XML tree supplied to `merge` with the given `target`. This requires a matching sub-tree root node to be provided (see example below).
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
        merge: |
          <application>
            <queries>
              <package android:name="com.azure.authenticator" />
            </queries>
          </application>

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
  - This operation takes either a raw string of Groovy-based Gradle, or an object. When using the object, make sure to set the `insertType` (see next line) to ensure the correct code is generated.
  - When using an object to insert, this operation takes an `insertType` of either `'method'` (default) or `'variable'` which will create either a method call (`methodName methodArg`) or an assignment (`variable = value`).
  - See the examples below for more clarity on how to structure the insert operation
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

      - file: variables.gradle
        target:
          ext:
        insertType: 'variable'
        insert:
          - firebaseMessagingVersion: '20.0.6'

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

Files can also be copied by using the `source` option instead of `text`:

```yaml
platforms:
  android:
    res:
      - path: drawable
        file: icon.png
        source: ../common/test/fixtures/icon.png
```

`source` supports a URL instead of a local path for remote resource loading.

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
- `merge` merges the given XML tree supplied to `merge` with the given `target`. Merge expects a matching root node to be supplied. The merge algorithm merges any nodes that match with _at least all_ of the supplied node's attributes, or appends any new children not found in the target node.
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
          <field>
            <string>Value</string>
          </field>
      - resFile: values/strings.xml
        target: resources/string[@name="app_name"]
        replace: |
          <string name="app_name">Awesome App</string>
```

### `copy`

Copies files, directories, or URLs relative to the root of the android project (`./android` by default).

```yaml
platforms:
  android:
    copy:
      - src: ../firebase/google-services.json
        dest: app/google-services.json
      - src: old/path/of/directory
        dest: new/path/of/directory
      - src: https://example.com/file.png
        dest: new/path/of/file.png
```