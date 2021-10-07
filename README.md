# Capacitor Configure

A utility for automatically configuring native [Capacitor](https://capacitorjs.com/) projects in a predictable and safe way.

## Installation

```bash
npm install @capacitor/configure
```

Add to your npm scripts:

## Usage

```bash
npx cap-config config.yaml
```

## Writing Configuration Files

Configuration files are written in YAML. New to YAML? Read [Learn YAML in five minutes](https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes).

```yaml
environments:
  - prod:
    ios:
      - bundleId: com.example.awesome
      - file: Info.plist
        key: NSHealthShareUsageDescription
        string: We'd like to access your health info
      - entitlements:
          - Health Kit: true

    android:
      - package: com.example.awesome
      - file: build.gradle
        buildscript:
          dependencies:
            - classpath: "org.javassist:javassist:3.27.0-GA"
            - classpath: files("./app/src/main/libs/com.microsoft.intune.mam.build.jar")

      - file: app/build.gradle
        text: |
          dependencies {
            implementation files("./src/main/libs/Microsoft.Intune.MAM.SDK.aar")
            implementation 'com.microsoft.identity.client:msal:1.5.5'
          }

    windows:
      - file: Project.csproj
        Project:
          ItemGroup:
            - PackageReference:
              Include: "Newtonsoft.Json"
              Version: "14.0.0"
```

## Configuration File Structure

The top-level `environments` list takes a set of environments along with the configuration options for each environment. There must be at least one environment, and the first entry will be used as the default.
