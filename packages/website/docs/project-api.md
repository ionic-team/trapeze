---
title: Project API
sidebar_label: Project API
---

To write custom scripts and code that manage iOS and Android targets in your Capacitor project, install the `@capacitor/project` package:

```bash
npm install @capacitor/project
```

## TypeScript Note

Make sure the `dom` lib is enabled in your `tsconfig.json` in the `lib` entry under `compilerOptions`.

## Requirements

For iOS: the tool currently expects your iOS project to be in an `App` folder inside of the Capacitor platform project folder. For example: `ios/App`.

For Android: `JAVA_HOME` must be set to use Gradle configuration. This is because the Gradle modification functionality uses a Java utility under the hood for accuracy, as Gradle is a Groovy DSL and Groovy is a JVM language. If you have Android Studio installed, you can use [the JDK bundled with it](https://stackoverflow.com/questions/43211282/using-jdk-that-is-bundled-inside-android-studio-as-java-home-on-mac).

### API Usage

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

## Committing Changes

The API works by updating files in a virtual filesystem, and no changes are actually committed to the filesystem until `project.commit()` is called. When your changes are ready to be saved, run

```typescript
project.commit();
```

To get a preview of changes that will be committed, the `VFS` object can be accessed on the project:

```typescript
const changedFiles = project.vfs.all();
changedFiles.forEach(f => {
  console.log(f.getFilename(), f.getData());
});
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
project.ios?.getTargets();
// Targets have properties like id, name, productName, productType, and a list of buildConfigurations

// Get the main app target in the project
const appTarget = project.ios?.getAppTarget();
```

### Project Settings

#### Bundle ID

```typescript
// Get the bundle id for the given target, pass the build name as an optional second parameter
project.ios?.getBundleId(appTarget.name);
project.ios?.setBundleId(targetName, buildName, 'io.ionic.betterBundleId');
project.ios?.setBundleId(targetName, null, 'io.ionic.betterBundleId');
```

#### Version and Build Number

The version and build number can be managed, including incrementing the build number which is useful for automated builds:

```typescript
// Get the numeric build number (aka CURRENT_PROJECT_VERSION) for the given target and build name
project.ios?.getBuild(targetName, buildName);
// Get the version name (aka the MARKETING_VERSION)
project.ios?.getVersion(targetName, buildName);

// Set the numeric build number
await project.ios?.setBuild(targetName, buildName, 42);
// Increment the build number
await project.ios?.incrementBuild(targetName, buildName);
// Set the marketing version
await project.ios?.setVersion(targetName, buildName, '1.2.3');
```

#### Display Name

The display name can be managed:

```typescript
project.ios?.getDisplayName(targetName, buildName);
project.ios?.setDisplayName(targetName, buildName, 'Really Awesome App');
```

#### Info.plist

Modifications to the `Info.plist` for the given target and build can be made by passing in an object corresponding to entries in the plist.

Note: this method will use the registered `INFOPLIST_FILE` for the given target and build so make sure that is set correctly if you've renamed the `Info.plist` file.

```typescript
await project.ios?.updateInfoPlist(targetName, buildName, {
  NSFaceIDUsageDescription: 'The better to see you with',
});

// Get the relative path to the Info.plist for the target and build
await project.ios?.getInfoPlist(targetName, buildName);
// Get the full path to the Info.plist
await project.ios?.getInfoPlistFilename(targetName, buildName);
```

#### Frameworks

Frameworks, Libraries, and Embedded Content can be managed:

```typescript
project.ios?.addFramework(targetName, 'ImageIO.framework');

// Complex framework setups can pass options. Boolean fields supported:
// embed, link, customFramework
project.ios?.addFramework(targetName, 'Custom.framework', {
  embed: true,
});
project.ios?.getFrameworks(targetName);
```

#### Entitlements

Entitlements can be managed:

```typescript
// The key for the key/value entries should be the low-level entitlement key,
// which can be found on the Apple docs: https://developer.apple.com/documentation/bundleresources/entitlements?language=objc
await project.ios?.addEntitlements(targetName, buildName, {
  'keychain-access-groups': ['group1', 'group2'],
});
await project.ios?.getEntitlements(targetName);
```

#### Build Configurations

Build settings for targets and specific builds can be managed:

```typescript
// Configurations will be an array of object with fields name and buildSettings which is an object
// containing all build varibles for the build in the target, such as compiler options like
// ENABLE_BITCODE
project.ios?.getBuildConfigurations(target);

// Individual build properties can be read or written:
project.ios?.setBuildProperty(targetName, buildName, 'FAKE_PROPERTY', 'YES');
project.ios?.getBuildProperty(targetName, buildName, 'FAKE_PROPERTY');
```

## Android

Android functionality currently supported includes making modifications to `AndroidManifest.xml` (attributes and new elements), updating package name, updating version name/code, adding resources files, and making Gradle modifications.

### Project Settings

#### Package Name

```typescript
project.android?.setPackageName('com.ionicframework.awesome');
project.android?.getPackageName();
```

#### Version Name and Code

```typescript
await project.ios?.setVersion('App', 'Debug', '1.4.5');
await project.ios?.incrementBuild('App');
project.ios?.getBuild('App', 'Debug');
project.ios?.getBuild('App', 'Release');
await project.android?.setVersionName('1.0.2');
await project.android?.getVersionName();
await project.android?.setVersionCode(11);
await project.android?.getVersionCode();
await project.android?.incrementVersionCode();
```

#### Android Manifest

Attributes can be added/modified on target elements, and new XML fragments can be injected. Note: if an XPath selector returns multiple elements, the operation will be applied to each.

```typescript
// Set attributes on a target element:
project.android?.getAndroidManifest().setAttrs('manifest/application', {
  'android:name': 'com.ionicframework.test.CoolApplication',
});

// Inject fragment at target:
project.android?.getAndroidManifest().injectFragment(
  'manifest',
  `
<queries>
  <package />
  <intent>
  </intent>
</queries>
`,
);
```

There is also a method for querying the manifest using an XPath selector:

```typescript
project.android?.getAndroidManifest().find('manifest/application');
```

#### Resource Files

Resource files can be created or existing files copied to:

```typescript
// Add a resource to the given resource directory with the given name and contents
await project.android?.addResource('raw', 'test.json', `{}`);
// Existing files can also be copied, passing the source of the file as the last argument
await project.android?.copyToResources('drawable', 'icon.png', source);

// To load an existing resource:
const data = await project.android?.getResource('raw', 'test.json');
```

#### Gradle

Gradle modifications are the most complicated and powerful of the capabilities in this library. Remember, `JAVA_HOME` must be set before using these methods.

Note: this feature only supports Groovy-based Gradle files.

First, get a reference to the `GradleFile` from the project. There are two possible options currently supported when referenced from the project: `build.gradle` or `app/build.gradle`. To modify other Gradle files use GradleFile directly.

```typescript
const buildGradleFile = project.android?.getGradleFile('build.gradle');
const appBuildGradleFile = project.android?.getGradleFile('app/build.gradle');
```

Gradle fragment strings can be injected at specific locations in the Gradle file, or new properties can be added using an object syntax.

To add properties:

```typescript
// The first argument is the target element. This uses a nested syntax where the terminal method/property name should have an empty object. The second element is an array of new gradle properties to insert:
buildGradleFile.insertProperties(
  {
    buildscript: {},
  },
  [{ classpath: 'com.my.custom.gradle.plugin' }],
);
```

To add raw Gradle strings:

```typescript
appBuildGradleFile.insertFragment({
  allprojects: {
    repositories: {}
  }
}, [{
  maven: [
    { url: 'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1' },
    { name: 'Duo-SDK-Feed }
  ]
}]
```