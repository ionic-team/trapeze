import executeAndroidPackageName from '../operations/android/packageName.mjs';
import executeAndroidGradle from '../operations/android/gradle.mjs';
import executeAndroidRes from '../operations/android/res.mjs';
import executeAndroidManifest from '../operations/android/manifest.mjs';
import executeAndroidVersion from '../operations/android/version.mjs';
import executeIosProject from '../operations/ios/project.mjs';
import executeIosFrameworks from '../operations/ios/frameworks.mjs';
import executeIosEntitlements from '../operations/ios/entitlements.mjs';
import executeIosPlist from '../operations/ios/plist.mjs';
import executeIosBuildVersion from '../operations/ios/buildVersion.mjs';
import executeIosBuildSettings from '../operations/ios/buildSettings.mjs';

const operations = {
  'ios.plist': executeIosPlist,
  'ios.bundleId': executeIosProject,
  'ios.displayName': executeIosProject,
  'ios.productName': executeIosProject,
  'ios.version': executeIosBuildVersion,
  'ios.incrementBuild': executeIosBuildVersion,
  'ios.buildSettings': executeIosBuildSettings,
  'ios.frameworks': executeIosFrameworks,
  'ios.entitlements': executeIosEntitlements,
  'ios.build.gradle': executeAndroidGradle,
  'android.manifest': executeAndroidManifest,
  'android.res': executeAndroidRes,
  'android.packageName': executeAndroidPackageName,
  'android.versionName': executeAndroidVersion,
  'android.versionCode': executeAndroidVersion,
  'android.incrementVersionCode': executeAndroidVersion,
};

const enabled = null; //['ios.plist'];

export function runOperation(ctx, op) {
  const handler = operations[op.id];

  if (enabled !== null && !enabled.find(e => e.id === op.id)) {
    return Promise.resolve();
  }

  if (handler) {
    return handler(ctx, op);
  } else {
    return Promise.reject(`No handler for operation ${op.id}`);
  }
}

export function hasHandler(op) {
  return !!operations[op.id];
}
