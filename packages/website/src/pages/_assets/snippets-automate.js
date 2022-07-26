module.exports = {
  iOS: {
    code: `platforms:
  ios:
    targets:
      App:
        incrementBuild: true
        version: 16.4
        productName: Awesome App
        displayName: My Awesome App

        buildSettings:
          ENABLE_BITCODE: false
          STRIP_SWIFT_SYMBOLS: false

        plist:
          replace: false
          entries:
            - NSFaceIDUsageDescription: Use Face ID to authenticate yourself and login

        entitlements:
          - keychain-access-groups:
              [
                'com.keychain.access.group'
              ]

        frameworks:
          - CoreServices.framework
          - ImageIO.framework
          - LocalAuthentication.framework
          - WebKit.framework`,
    language: 'yaml',
  },
  Android: {
    code: `platforms:
  android:
    incrementVersionCode: true

    manifest:
      - file: AndroidManifest.xml
        target: manifest/application
        attrs:
          android:name: com.example.App

      - file: AndroidManifest.xml
        target: manifest
        inject: |
          <queries>
              <intent>
                  <action android:name="android.intent.action.MAIN" />
                  <category android:name="android.intent.category.LAUNCHER" />
              </intent>
          </queries>
    gradle:
      - file: app/build.gradle
        target:
          dependencies:
        insert: |
          implementation "com.stripe:stripe-java:20.133.0"
    res:
      - path: raw
        file: config.json
        text: |
          {
            "value": true
          }
      - path: drawable
        file: icon.png
        source: ./public/assets/icon/icon.png`,
    language: 'yaml',
  },
};
