module.exports = {
  customize: [
    {
      code: `import { MobileProject, MobileProjectConfig } from '@trapezedev/project';

const project = new MobileProject(projectDir, {
  path: 'ios',
},
android: {
  path: 'android',
});
await project.load();

// Updating plist files for targets and builds
await project.ios?.updateInfoPlist('App', 'Debug', {
  NSFaceIDUsageDescription: 'The better to see you with',
});

// Adding frameworks
project.ios?.addFramework(targetName, 'Custom.framework', {
  embed: true,
});

await project.commit();`,
      language: 'js',
    },
  ],
  variables: [
    {
      code: `vars:
  BUNDLE_ID:
    default: dev.trapeze.defaultBundleId
  PACKAGE_NAME:
    default: dev.trapeze.defaultPackageName
  KEYCHAIN_GROUPS:
    default:
        [
          '$BUNDLE_ID',
        ]
  

platforms:
  ios:
    targets:
      App:
        bundleId: $BUNDLE_ID
        entitlements:
          - keychain-access-groups: $KEYCHAIN_GROUPS
        
  android:
    packageName: $PACKAGE_NAME
  `,
      language: 'yaml',
    },
  ],
  cicd: [
    {
      code: `vars:
  CI_BUILD_NUMBER:
    default: 1

platforms:
  ios:
    buildNumber: $CI_BUILD_NUMBER
  android:
    versionCode: $CI_BUILD_NUMBER`,
      language: 'yaml',
    },
    {
      code: `"scripts": {
  "appflow:build": "npx trapeze run appflow.yml -y && npm run build"
},`,
      language: 'json',
    },
  ],
};
