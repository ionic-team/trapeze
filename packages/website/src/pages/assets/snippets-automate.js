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
          STRIP_SWIFT_SYMBOLS:: false

        plist:
          replace: false
          entries:
            - NSFaceIDUsageDescription: Use Face ID to authenticate yourself and login

        entitlements:
          - keychain-access-groups:
              [
                'com.keychain.access.group'`,
    language: 'yaml',
  },
  Android: {
    code: `platforms:
  android:
    targets:
      App:
        incrementBuild: true
        version: 16.4
        productName: Awesome App
        displayName: My Awesome App

        buildSettings:
          ENABLE_BITCODE: false
          STRIP_SWIFT_SYMBOLS:: false

        plist:
          replace: false
          entries:
            - NSFaceIDUsageDescription: Use Face ID to authenticate yourself and login

        entitlements:
          - keychain-access-groups:
              [
                'com.keychain.access.group'`,
    language: 'yaml',
  },
};
