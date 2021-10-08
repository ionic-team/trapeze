// Given the parsed yaml file, generate a set of operations to perform against the project
export function processOperations(yaml) {
  return processEnvironments(yaml.environments).flat();
}

function processEnvironments(envs) {
  return Object.keys(envs)
    .map(env => createEnvironment(env, envs[env]))
    .flat();
}

function createEnvironment(env, envEntry) {
  return Object.keys(envEntry || {}).map(platform =>
    createPlatform(env, platform, envEntry[platform]),
  );
}

function createPlatform(env, platform, platformEntry) {
  return Object.keys(platformEntry || {}).map(op =>
    createOperation(env, platform, op, platformEntry[op]),
  );
}

function createOperation(env, platform, op, opEntry) {
  const opRet = {
    env,
    platform,
    name: op,
    value: opEntry,
  };

  return {
    ...opRet,
    displayText: createOpDisplayText(opRet),
  };
}

function createOpDisplayText(op) {
  switch (op.name) {
    // ios
    case 'bundleId':
      return op.value;
    case 'entitlements':
      return op.value.map(v => Object.keys(v)).join(', ');
    case 'frameworks':
      return op.value.join(', ');

    // android
    case 'package':
      return op.value;

    case 'build.gradle':
      return '';
    case 'app.build.gradle':
      return '';
    case 'res':
      return op.value.map(r => r.file).join(', ');
  }

  return '';
}
