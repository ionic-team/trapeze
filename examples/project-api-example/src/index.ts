import { MobileProject, MobileProjectConfig } from '@trapezedev/project';

var argv = require('minimist')(process.argv.slice(2));

// Pass in the path to the project root directory
const projectDir = argv.project;

if (!projectDir) {
  console.error('Usage: index.js --project path-to-project-root');
  process.exit(1);
} else {
  console.log(projectDir);
}

const config: MobileProjectConfig = {
  ios: {
    path: 'ios',
  },
  android: {
    path: 'android',
  },
};


async function run() {
  const project = new MobileProject(projectDir, config);
  await project.load();

  const appTarget = project.ios!.getAppTarget();
  await project.ios?.addEntitlements(appTarget?.name ?? null, null, {
    'keychain-access-groups': ['group1', 'group2'],
  });

  // If you want to see the changes before committing
  // const changes = project.vfs.all();

  await project.commit();
}

run();

