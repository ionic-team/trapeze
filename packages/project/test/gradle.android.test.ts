import { CapacitorConfig } from "@capacitor/cli";
import { CapacitorProject } from '../src';
import { Gradle, GradleASTNode, GradleAST } from '../src/android/gradle';

import { join } from 'path';
import { VFS } from "../src/vfs";

describe('project - android - gradle', () => {
  let config: CapacitorConfig;
  let project: CapacitorProject;
  let vfs: VFS;
  beforeEach(async () => {
    config = {
      ios: {
        path: '../common/test/fixtures/ios'
      },
      android: {
        path: '../common/test/fixtures/android'
      }
    }

    project = new CapacitorProject(config);
    await project.load();
    vfs = new VFS();
  });

  it('Should find path to gradle parse', async () => {
    const gradle = new Gradle(join(project.config.android!.path!, 'build.gradle'), vfs);
    expect(gradle.getGradleParserPath()).not.toBeUndefined();

    const output = await gradle.parse();
    expect(output).not.toBeNull();
  });

  it.skip('Should throw an exception if no JAVA_HOME set', async () => {
    process.env.JAVA_HOME = '';
    const gradle = new Gradle(join(project.config.android!.path!, 'build.gradle'), vfs);
    await expect(gradle.parse()).rejects.toThrow();
  });

  it.only('Should find target element in parsed Gradle', async () => {
    const gradle = new Gradle(join(project.config.android!.path!, 'build.gradle'), vfs);
    console.log(JSON.stringify(await gradle.parse(), null, 2));

    let nodes = gradle.find({
      buildscript: {
        dependencies: {}
      }
    });

    console.log('Nodes', JSON.stringify(nodes, null, 2));

    expect(nodes.length).not.toBe(0);
    expect(nodes[0].type).toBe('method');
    expect(nodes[0].name).toBe('dependencies');

    // Should find the root node
    nodes = gradle.find({});

    console.log('Nodes', JSON.stringify(nodes, null, 2));

    expect(nodes.length).not.toBe(0);
    console.log(nodes);
    // expect(nodes[0].type).toBe('root');
  });

  it('Should inject at spot', async () => {
    const gradle = new Gradle(join(project.config.android!.path!, 'app', 'build.gradle'), vfs);
    console.log(JSON.stringify(await gradle.parse(), null, 2));

    await gradle.injectProperties({
      dependencies: {}
    }, [
      { classpath: "'com.super.cool'" },
      { classpath: "'com.super.amazing'" },
    ]);


  });

  it('Should inject at root', async () => {
    const gradle = new Gradle(join(project.config.android!.path!, 'app', 'build.gradle'), vfs);
    console.log(JSON.stringify(await gradle.parse(), null, 2));

    await gradle.injectProperties({}, [
      { 'apply from:': "'my.cool.package'" }
    ]);
  });
});