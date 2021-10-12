# Capacitor Configure

A utility for automatically configuring native [Capacitor](https://capacitorjs.com/) projects in a predictable and safe way.

## Installation

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

```yaml
vars:
  BUNDLE_ID:
    default: io.ionic.wowzaStarter
  INTUNE_CLIENT_ID:
  INTUNE_ADAL_AUTHORITY:
  INTUNE_REDIRECT_URI_IOS:

platforms:
  ios:
    bundleId: $BUNDLE_ID

    plist:
      - file: Info.plist
        entries:
          NSFaceIDUsageDescription: Use Face ID to authenticate yourself and login

      - file: Info.plist
        entries:
          CFBundleURLTypes:
            - CFBundleURLSchemes:
                - msauth.$(PRODUCT_BUNDLE_IDENTIFIER)
                - msauth.$(PRODUCT_BUNDLE_IDENTIFIER)-intunemam
                - msauth.com.microsoft.intunemam

      - file: Info.plist
        entries:
          LSApplicationQueriesSchemes:
            - mvisionmobile
            - msauthv2
            - scmx
            - lookoutwork-ase
            - msauthv3
            - lacoonsecurity
            - zips
            - skycure
            - smart-ns
            - smsec
            - betteractiveshield
            - companyportal
            - wandera
            - https-intunemam
            - http-intunemam
            - microsoft-edge-https-intunemam
            - microsoft-edge-http-intunemam
            - ms-outlook-intunemam

      - file: Info.plist
        entries:
          IntuneMAMSettings:
            ADALClientId: $INTUNE_CLIENT_ID
            ADALAuthority: $INTUNE_ADAL_AUTHORITY
            ADALRedirectUri: $INTUNE_REDIRECT_URI_IOS

    entitlements:
      - keychain-access-groups:
          ['$BUNDLE_ID', 'com.microsoft.intune.mam', 'com.microsoft.adalcache']
    frameworks:
      - AudioToolbox.framework
      - CoreServices.framework
      - ImageIO.framework
      - libc++.tbd
      - libqslite3.tbd
      - LocalAuthentication.framework
      - MessageUI.framework
      - QuartzCore.framework
      - Security.framework
      - SystemConfiguration.framework
      - WebKit.framework

  android:
    package: io.ionic.awesomeStarter
    build.gradle:
      buildscript:
        dependencies:
          - classpath: 'org.javassist:javassist:3.27.0-GA'
          - classpath: files("./app/src/main/libs/com.microsoft.intune.mam.build.jar")

    app.build.gradle:
      dependencies:
        - implementation: files("./src/main/libs/Microsoft.Intune.MAM.SDK.aar")
        - implementation: 'com.microsoft.identity.client:msal:1.5.5'

      apply plugin: 'com.microsoft.intune.mam'
      intunemam:
        includeExternalLibraries:
          - 'androidx.*'
          - 'com.getcapacitor.*'

    res:
      - path: raw
        file: auth_config.json
        text: |
          {
            "client_id": "f80e2e59-01b2-4f88-be80-4895a63eae7e",
            "authorization_user_agent": "DEFAULT",
            "redirect_uri": "msauth://io.ionic.starter/uHU%2BUi09K1zPjWX4mZFggrgz%2Brk%3D",
            "broker_redirect_uri_registered": true,
            "authorities": [
              {
                "type": "AAD",
                "audience": {
                  "type": "AzureADMyOrg",
                  "tenant_id": "453daf0a-cd18-4085-bfd7-fb9431630f11"
                }
              }
            ]
          }


```

## Supported Operations


| Platform | Operation | Supported |
-----------| ----------|------------|
| ios | Bundle ID | :white_check_mark: |
| ios | Info.plist | :white_check_mark: |
| ios | Add Frameworks | :white_check_mark: |
| ios | Set Entitlements | :white_check_mark: |
| android | Package ID | :white_check_mark: |
| android | Gradle Config | :white_check_mark: |

## Configuration File Structure

The top-level `environments` list takes a set of environments along with the configuration options for each environment. There must be at least one environment, and the first entry will be used as the default.
