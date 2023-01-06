---
title: Getting Started
sidebar_position: 1
sidebar_label: Getting Started
---

To configure projects using Trapeze's configuration-driven experience, install the `@trapezedev/configure` package.

```bash
npm install @trapezedev/configure
```

:::note

For Android: Java must be on `PATH` or `JAVA_HOME` must be set to use Gradle operations. This is because the Gradle modification functionality uses a Java utility under the hood for accuracy, as Gradle is a Groovy DSL and Groovy is a JVM language. If you have Android Studio installed, you can use [the JDK bundled with it](https://stackoverflow.com/questions/43211282/using-jdk-that-is-bundled-inside-android-studio-as-java-home-on-mac). Note: `JAVA_HOME` should be set to the root of the JDK installation, *not* the `/bin` folder.

:::

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

Changes can be previewed using the `--diff` flag to see a unified diff of the changes to each file.


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

### JSON Variables

Variables can be strings or any JSON-parsable value. This makes them capable of being used for more complex configuration. Additionally, variable substitution also applies to any JSON values so references to other variables can be made:

```yaml
vars:
    KEYCHAIN_GROUPS:
      default:
        [
          '$BUNDLE_ID',
        ]

platforms:
  ios:
    targets:
      App:
        entitlements:
          - keychain-access-groups: $KEYCHAIN_GROUPS
```

### Variable types

*Since: 7.0.3*

Since environment variables are always strings, values that are meant to be numbers can be incorrectly processed. To specify the exact type a variable must have, use the `type` field when defining variables:

```yaml
vars:
    NUMBER_VALUE:
      type: number
```

The supported types are `string`, `number`, `array`, and `object`.

`string` values will be consumed as-is, `number` values will be passed through `parseInt(v, 10)`, and both `array` and `object` will be passed through `JSON.parse(v)`.

## Next steps

Follow the [Android](./android), [iOS](./ios), and [Project-level](./project) guides to see the full set of operations available for each platform.