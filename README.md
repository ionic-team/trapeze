<div align="center">
  <a href="https://trapeze.dev" target="_blank"><img src="https://github.com/ionic-team/trapeze/raw/main/logo.png" alt="Trapeze Logo" width="512" /></a>
</div>

<p align="center">
  🤸‍♀️ Easy automated project configuration for iOS, Android, Capacitor, React Native, Flutter, and more 🤸‍♀️
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@trapezedev/configure"><img src="https://img.shields.io/npm/v/@trapezedev/configure?label=@trapezedev/configure" /></a>
  <a href="https://www.npmjs.com/package/@trapezedev/project"><img src="https://img.shields.io/npm/v/@trapezedev/project?label=@trapezedev/project" /></a>
</p>

---

Trapeze makes it easy to automate the configuration of native mobile iOS and Android projects, and supports traditional native, [Ionic](https://ionicframework.com/), [Capacitor](https://capacitorjs.com/), React Native, Flutter, and .NET MAUI. The long-term goal of Trapeze is to enable fully immutable native mobile projects.

Trapeze works by automating the modification of pbxproj, plist, XML, Gradle, JSON, resource, properties, and other files in iOS and Android app projects. It features a configuration-driven tool that takes a YAML file with iOS and Android project modifications and performs those modifications from the command line interactively.

For example, modifying your project is as easy as writing a configuration file:

```yaml
platforms:
  ios:
    targets:
      App:
        bundleId: $BUNDLE_ID
        version: $VERSION

  android:
    packageName: com.example.app
    versionName: $VERSION_NAME
    versionCode: $VERSION_CODE
```

Each one of these variables can be supplied from the environment or interactively when running the command. There are <a href="https://trapeze.dev/docs/operations/getting-started">many more configuration options</a> available.

A Project API is also available for writing custom JavaScript/TypeScript project modification scripts for full control. The configuration tool uses this API under the hood.

See [trapeze.dev](https://trapeze.dev) for full documentation and to get started using Trapeze.

__Note: this project was formerly known as `capacitor-configure` but has now been expanded to support other mobile frameworks and renamed to Trapeze as of June 2022__

