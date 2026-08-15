#!/usr/bin/env node
// Packs the three published packages, installs the tarballs into a throwaway
// project and runs the CLI against a fixture app.
//
// This covers what the unit suites cannot: an incomplete `files` field, and
// operation modules that fail to load from the compiled `dist` directory —
// `loadHandlers()` swallows those import errors, so a broken operation silently
// disappears instead of failing the run.

import { execFileSync } from 'child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = join(REPO_ROOT, 'packages/common/test/fixtures');
const PACKAGES = ['packages/gradle-parse', 'packages/project', 'packages/configure'];

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function exec(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf-8',
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`smoke test failed: ${message}`);
  }
}

function assertContains(file, expected) {
  const contents = readFileSync(file, 'utf-8');
  assert(contents.includes(expected), `${file} does not contain ${JSON.stringify(expected)}`);
}

function assertGradleParseTarballIsComplete() {
  const [{ files }] = JSON.parse(
    exec(npm, ['pack', '--dry-run', '--json', '-w', 'packages/gradle-parse'], REPO_ROOT),
  );
  const paths = files.map(f => f.path);

  for (const expected of [/^capacitor-gradle-parse\.jar$/, /^lib\/groovy-.*\.jar$/, /^lib\/json-.*\.jar$/]) {
    assert(
      paths.some(path => expected.test(path)),
      `@trapezedev/gradle-parse tarball has no file matching ${expected} (has ${paths.join(', ')})`,
    );
  }
}

function packAndInstall(workDir) {
  const args = ['pack', ...PACKAGES.flatMap(p => ['-w', p]), '--pack-destination', workDir, '--json'];
  const tarballs = JSON.parse(exec(npm, args, REPO_ROOT)).map(({ filename }) => `./${filename}`);

  writeFileSync(join(workDir, 'package.json'), JSON.stringify({ name: 'trapeze-smoke', private: true }));
  exec(npm, ['install', '--no-audit', '--no-fund', ...tarballs], workDir);
}

function createProject(workDir) {
  const projectDir = join(workDir, 'proj');

  cpSync(join(FIXTURES, 'ios-and-android'), projectDir, { recursive: true });
  cpSync(join(FIXTURES, 'basic.yml'), join(projectDir, 'config.yml'));

  // basic.yml copies an icon from a path relative to the working directory
  mkdirSync(join(workDir, 'common/test/fixtures'), { recursive: true });
  cpSync(join(FIXTURES, 'icon.png'), join(workDir, 'common/test/fixtures/icon.png'));

  return projectDir;
}

function runCli(workDir, projectDir) {
  const cli = join(workDir, 'node_modules/@trapezedev/configure/bin/trapeze');
  const output = exec(process.execPath, [cli, 'run', 'config.yml', '-y'], projectDir);

  console.log(output);
  assert(
    !output.includes('Unsupported configuration option'),
    'the installed CLI did not register every operation',
  );

  assertContains(join(projectDir, 'ios/App/App.xcodeproj/project.pbxproj'), 'PRODUCT_BUNDLE_IDENTIFIER = io.ionic.fixtureTest');
  assertContains(join(projectDir, 'ios/App/App/Info.plist'), 'msauth.com.microsoft.intunemam');
  // The Gradle assertions are the ones that exercise the Java parser
  assertContains(join(projectDir, 'android/app/build.gradle'), 'versionCode 197');
  assertContains(join(projectDir, 'android/build.gradle'), 'org.javassist');
  assertContains(join(projectDir, 'android/app/src/main/res/values/strings.xml'), 'Awesome App');
}

const workDir = mkdtempSync(join(tmpdir(), 'trapeze-smoke-'));

try {
  assertGradleParseTarballIsComplete();
  packAndInstall(workDir);
  runCli(workDir, createProject(workDir));
  console.log('Smoke test passed');
} finally {
  rmSync(workDir, { force: true, recursive: true });
}
