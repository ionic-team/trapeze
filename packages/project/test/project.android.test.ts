import { CapacitorConfig } from "@capacitor/cli";
import { CapacitorProject } from '../src';

import { join } from 'path';
import { readFile } from '@ionic/utils-fs';

describe('project - android', () => {
  let config: CapacitorConfig;
  let project: CapacitorProject;
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
  });

  it('should load project', async () => {
    expect(project.android.getAndroidManifest()).not.toBe(null);
  });

  it('should set package name', async () => {
    project.android.setPackageName('com.ionicframework.awesome');
    expect(project.android.getPackageName()).toBe('com.ionicframework.awesome');
  });

  it('should add an attribute on a manifest node', async () => {
    project.android.getAndroidManifest().setAttrs('manifest/application', {
      'android:name': 'com.ionicframework.test.CoolApplication'
    });

    const applicationNode = project.android.getAndroidManifest().find('manifest/application')?.[0];
    expect(applicationNode.getAttribute('android:name')).toBe('com.ionicframework.test.CoolApplication');
  });

  it('should inject an XML fragment', async () => {
    project.android.getAndroidManifest().injectFragment('manifest', `
    <queries>
      <package />
      <intent>
      </intent>
    </queries>
    `);

    const queriesNode = project.android.getAndroidManifest().find('manifest/queries')?.[0];
    expect(queriesNode).toBeDefined();
    expect(queriesNode.nodeName).toBe('queries');
    const intentNode = project.android.getAndroidManifest().find('manifest/queries/intent')?.[0];
    expect(intentNode).toBeDefined();
    expect(intentNode.nodeName).toBe('intent');
  });

  it('should set version', async () => {
    await project.android.setVersionName('1.0.2');
    expect(await project.android.getVersionName()).toBe('1.0.2');

    await project.android.setVersionCode(11);
    expect(await project.android.getVersionCode()).toBe(11);
  });

  it('should add resources file', async () => {
    await project.android.addResource('raw', 'test.json', `{
      "thing": "cool"
    }`);

    const found = await project.android.getResource('raw', 'test.json');
    expect(found).toEqual(`{
      "thing": "cool"
    }`);
  });

  it('should copy resources file', async () => {
    const src = join('../', 'common', 'test', 'fixtures', 'icon.png');
    const srcContents = await readFile(src);
    await project.android.copyToResources('drawable', 'icon.png', src);
    const destContents = await project.android.getResource('drawable', 'icon.png', null) as Buffer;

    expect(Buffer.compare(srcContents, destContents)).toBe(0);
  });

  /*
  it('should add to gradle', async () => {
    await project.android.injectGradle('app/build.gradle', {
      dependencies: [
        { implementation: 'files("./src/main/libs/Microsoft.Intune.MAM.SDK.aar")' },
        { implementation: 'com.microsoft.identity.client:msal:1.5.5' }
      ]
    });
  });
  */
});