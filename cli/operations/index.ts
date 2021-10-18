import executeAndroidPackageName from './android/packageName';
import executeAndroidGradle from './android/gradle';
import executeAndroidRes from './android/res';
import executeAndroidManifest from './android/manifest';
import executeAndroidVersion from './android/version';
import executeIosProject from './ios/project';
import executeIosFrameworks from './ios/frameworks';
import executeIosEntitlements from './ios/entitlements';
import executeIosPlist from './ios/plist';
import executeIosBuildVersion from './ios/buildVersion';
import executeIosBuildSettings from './ios/buildSettings';
import { Change } from '../../lib/change';
import { Context } from '../ctx';
import { Operation } from '../op';

type OperationHandler = (ctx: Context, op: Operation) => any;

interface OperationHandlers {
  [id: string]: OperationHandler;
}

const operations: OperationHandlers = {
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
