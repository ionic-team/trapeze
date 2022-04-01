import { Operation } from './definitions';

// Given the parsed yaml file, generate a set of operations to perform against the project
export function processOperations(yaml: any): Operation[] {
  return Object.keys(yaml.platforms || {})
    .map(p => createPlatform(p, yaml.platforms[p]))
    .flat();
}

function createPlatform(platform: string, platformEntry: any) {
  if (platform === 'android') {
    return createAndroidPlatform(platform, platformEntry);
  } else if (platform === 'ios') {
    return createIosPlatform(platform, platformEntry);
  }
  return [];
}

function createAndroidPlatform(platform: string, platformEntry: any) {
  if (!platformEntry) {
    return [];
  }

  return Object.keys(platformEntry || {}).map(op =>
    createOperation(platform, op, platformEntry[op]),
  ).flat();
}

function createIosPlatform(platform: string, platformEntry: any) {
  if (!platformEntry) {
    return [];
  }

  if (typeof platformEntry.targets !== 'undefined') {
    return createIosPlatformTargets(platform, platformEntry);
  } else {
    return Object.keys(platformEntry || {}).map(op =>
      createIosOperation({ platform, target: null, build: null, op, opEntry: platformEntry[op] })
    ).flat();
  }
}

function createIosPlatformTargets(platform: string, platformEntry: any) {
  return Object.keys(platformEntry.targets || {}).map(target =>
    createIosPlatformTarget(platform, target, platformEntry.targets[target])
  ).flat();
}

function createIosPlatformTarget(platform: string, target: string, targetEntry: any) {
  if (typeof targetEntry.builds !== 'undefined') {
    return createIosPlatformBuilds(platform, target, targetEntry);
  } else {
    return Object.keys(targetEntry || {}).map(op =>
      createIosOperation({ platform, target, build: null, op, opEntry: targetEntry[op] })
    ).flat();
  }
}

function createIosPlatformBuilds(platform: string, target: string, targetEntry: any) {
  return Object.keys(targetEntry.builds || {}).map(build =>
    createIosPlatformBuild(platform, target, build, targetEntry.builds[build])
    // createIosPlatformBuild({ platform, target, build, buildEntry: targetEntry.builds[build] })
  ).flat();
}

function createIosPlatformBuild(platform: string, target: string, build: string, buildEntry: any) {
  return Object.keys(buildEntry || {}).map(op =>
    createIosOperation({ platform, target, build, op, opEntry: buildEntry[op] })
  ).flat();
}

interface CreateIosOperation {
  platform: string;
  target: string | null;
  build: string | null;
  op: string;
  opEntry: any;
}
function createIosOperation({ platform, target, build, op, opEntry }: CreateIosOperation): Operation {
  const opRet = getOpIdAlias({
    id: `${platform}.${op}`,
    platform,
    name: op,
    iosTarget: target,
    iosBuild: build,
    value: opEntry,
  });

  return {
    ...(opRet as Operation),
    displayText: createOpDisplayText(opRet),
  };
}

function createOperation(platform: string, op: string, opEntry: any): Operation {
  const opRet = getOpIdAlias({
    id: `${platform}.${op}`,
    platform,
    name: op,
    value: opEntry,
    iosTarget: null,
    iosBuild: null
  });

  return {
    ...(opRet as Operation),
    displayText: createOpDisplayText(opRet),
  };
}

function getOpIdAlias(op: Partial<Operation>) {
  switch (op.id) {
    case 'ios.infoPlist':
      // Transform the old infoPlist format to new plist format
      return {
        ...op,
        id: 'ios.plist',
        value: {
          entries: [
            ...op.value
          ]
        }
      }
  }

  return op;
}

// TODO: Move this to per-operation for more powerful display
function createOpDisplayText(op: Partial<Operation>) {
  switch (op.id) {
    // ios
    case 'ios.bundleId':
      return op.value;
    case 'ios.productName':
      return op.value;
    case 'ios.displayName':
      return op.value;
    case 'ios.version':
      return op.value;
    case 'ios.buildNumber':
      return op.value;
    case 'ios.buildSettings':
      return Object.keys(op.value)
        .map(k => `${k} = ${op.value[k]}`)
        .join(', ');
    case 'ios.entitlements':
      return op.value.map((v: any) => Object.keys(v)).join(', ');
    case 'ios.frameworks':
      return op.value.join(', ');
    case 'ios.plist':
      return `${op.value.entries.length} modifications`;
    // android
    case 'android.packageName':
      return op.value;
    case 'android.versionName':
      return op.value;
    case 'android.versionCode':
      return op.value;
    case 'android.manifest':
      return `${op.value.length} modifications`;
    case 'android.build.gradle':
      return '';
    case 'android.app.build.gradle':
      return '';
    case 'android.res':
      return op.value.map((r: any) => r.file).join(', ');
  }

  return '';
}
