import executeAndroidAppName from './android/appName';
import executeAndroidPackageName from './android/packageName';
import executeAndroidGradle from './android/gradle';
import executeAndroidRes from './android/res';
import executeAndroidManifest from './android/manifest';
import executeAndroidVersion from './android/version';
import executeAndroidXml from './android/xml';
import executeAndroidJson from './android/json';
import executeAndroidCopy from './android/copy';

import executeIosProject from './ios/project';
import executeIosFrameworks from './ios/frameworks';
import executeIosEntitlements from './ios/entitlements';
import executeIosPlist from './ios/plist';
import executeIosBuildVersion from './ios/buildVersion';
import executeIosBuildSettings from './ios/buildSettings';
import executeIosXml from './ios/xml';
import executeIosJson from './ios/json';
import executeIosCopy from './ios/copy';
import executeIosStrings from './ios/strings';
import executeIosXCConfig from './ios/xcconfig';

import executeProjectCopy from './project/copy';
import executeProjectJson from './project/json';
import executeProjectXml from './project/xml';

import { Context } from '../ctx';
import { Operation } from '../definitions';

type OperationHandler = (ctx: Context, op: Operation) => Promise<any>;

interface OperationHandlers {
  [id: string]: OperationHandler;
}

const operations: OperationHandlers = {
  'project.json': executeProjectJson,
  'project.xml': executeProjectXml,
  'project.copy': executeProjectCopy,
  'ios.plist': executeIosPlist,
  'ios.bundleId': executeIosProject,
  'ios.displayName': executeIosProject,
  'ios.productName': executeIosProject,
  'ios.version': executeIosBuildVersion,
  'ios.buildNumber': executeIosBuildVersion,
  'ios.incrementBuild': executeIosBuildVersion,
  'ios.buildSettings': executeIosBuildSettings,
  'ios.frameworks': executeIosFrameworks,
  'ios.entitlements': executeIosEntitlements,
  'ios.build.gradle': executeAndroidGradle,
  'ios.xml': executeIosXml,
  'ios.json': executeIosJson,
  'ios.copy': executeIosCopy,
  'ios.strings': executeIosStrings,
  'ios.xcconfig': executeIosXCConfig,
  'android.appName': executeAndroidAppName,
  'android.manifest': executeAndroidManifest,
  'android.res': executeAndroidRes,
  'android.gradle': executeAndroidGradle,
  'android.packageName': executeAndroidPackageName,
  'android.versionName': executeAndroidVersion,
  'android.versionCode': executeAndroidVersion,
  'android.incrementVersionCode': executeAndroidVersion,
  'android.json': executeAndroidJson,
  'android.xml': executeAndroidXml,
  'android.copy': executeAndroidCopy,
};

export function isOpRegistered(opName: string) {
  return opName in operations;
}

const enabled: string[] | null = null; //['ios.plist'];

export function runOperation(ctx: Context, op: Operation) {
  const handler = operations[op.id];

  if (enabled !== null && !enabled.find((e: string) => e === op.id)) {
    return Promise.resolve();
  }

  if (handler) {
    return handler(ctx, op);
  } else {
    return Promise.reject(`No handler for operation ${op.id}`);
  }
}

export function hasHandler(op: Operation) {
  return !!operations[op.id];
}
