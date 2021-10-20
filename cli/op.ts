export interface Operation {
  id: string;
  platform: string;
  name: string;
  value: any;
  displayText: string;
}

export interface AndroidOperation extends Operation {
}

export interface IosOperation extends Operation {
  target?: string;
  build?: string;
}


// Given the parsed yaml file, generate a set of operations to perform against the project
export function processOperations(yaml: any) {
  return Object.keys(yaml.platforms)
    .map(p => createPlatform(p, yaml.platforms[p]))
    .flat();
}

function createPlatform(platform, platformEntry) {
  if (platform === 'android') {
    return createAndroidPlatform(platform, platformEntry);
  } else if (platform === 'ios') {
    return createIosPlatform(platform, platformEntry);
  }
}

function createAndroidPlatform(platform, platformEntry) {
  return Object.keys(platformEntry || {}).map(op =>
    createOperation(platform, op, platformEntry[op]),
  ).flat();
}

function createIosPlatform(platform, platformEntry) {
  if (platformEntry.targets) {
    return createIosPlatformTargets(platform, platformEntry);
  } else {
    return Object.keys(platformEntry || {}).map(op =>
      createIosOperation({ platform, target: null, build: null, op, opEntry: platformEntry[op] })
    ).flat();
  }
}

function createIosPlatformTargets(platform, platformEntry) {
  return Object.keys(platformEntry.targets || {}).map(target =>
    createIosPlatformTarget(platform, target, platformEntry.targets[target])
  ).flat();
}

function createIosPlatformTarget(platform, target, targetEntry) {
  if (targetEntry.builds) {
    return createIosPlatformBuilds(platform, target, targetEntry);
  } else {
    return Object.keys(targetEntry || {}).map(op =>
      createIosOperation({ platform, target, build: null, op, opEntry: targetEntry[op] })
    ).flat();
  }
}

function createIosPlatformBuilds(platform, target, targetEntry) {
  return Object.keys(targetEntry.builds || {}).map(build =>
    createIosPlatformBuild(platform, target, build, targetEntry.builds[build])
    // createIosPlatformBuild({ platform, target, build, buildEntry: targetEntry.builds[build] })
  ).flat();
}

function createIosPlatformBuild(platform, target, build, buildEntry) {
  return Object.keys(buildEntry || {}).map(op =>
    createIosOperation({ platform, target, build, op, opEntry: buildEntry[op] })
  ).flat();
}

function createIosOperation({ platform, target, build, op, opEntry }): IosOperation {
  const opRet = {
    id: `${platform}.${op}`,
    platform,
    name: op,
    target,
    build,
    value: opEntry,
  };

  return {
    ...opRet,
    displayText: createOpDisplayText(opRet),
  };
}

function createOperation(platform, op, opEntry): Operation {
  const opRet = {
    id: `${platform}.${op}`,
    platform,
    name: op,
    value: opEntry,
  };

  return {
    ...opRet,
    displayText: createOpDisplayText(opRet),
  };
}

// TODO: Move this to per-operation for more powerful display
function createOpDisplayText(op) {
  switch (op.id) {
    // ios
    case 'ios.bundleId':
      return op.value;
    case 'ios.productName':
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
      return op.value.map(v => Object.keys(v)).join(', ');
    case 'ios.frameworks':
      return op.value.join(', ');
    case 'ios.infoPlist':
      return `${op.value.length} modifications`;
    // android
    case 'android.packageName':
      return op.value;
    case 'android.versionName':
      return op.value;
    case 'android.versionCode':
      return op.value;
    case 'android.build.gradle':
      return '';
    case 'android.app.build.gradle':
      return '';
    case 'android.res':
      return op.value.map(r => r.file).join(', ');
  }

  return '';
}
