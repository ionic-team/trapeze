import { Context, loadContext } from '../src/ctx';
import { loadYamlConfig } from '../src/yaml-config';
import { processOperations } from '../src/op';
import { loadHandlers } from '../src/operations';
import { Operation } from '../src/definitions';
import { lstat, readdirp } from '@ionic/utils-fs';

import { join } from 'path';

describe('operation processing', () => {
  let ctx: Context;
  beforeEach(async () => {
    ctx = await loadContext('../common/test/fixtures');
  });

  describe('Loader', () => {
    // Verify that all the operations are loading correctly
    it('should load dynamic operations', async () => {
      const operations = await loadHandlers();
      const opFiles = await readdirp('./src/operations');
      let numDetectedOps = 0;

      for (const file of opFiles) {
        const s = await lstat(file);
        if (s.isDirectory()) {
          continue;
        }

        try {
          const f = await import(join('../', file));

          const meta = f.OPS;

          console.log(meta);

          if (meta) {
            for (const _ of meta) {
              numDetectedOps++;
            }
          }
        } catch (e) {
          console.error('Unable to import', e);
        }
      }

      console.log('Got detected', numDetectedOps);

      expect(numDetectedOps).toBe(Object.keys(operations).length);
    });
  });

  describe('Project', () => {
    it('should process project operations', async () => {
      const makeOp = (name: string, value: any): Operation => ({
        id: `project.${name}`,
        platform: 'project',
        name,
        value,
        iosTarget: null,
        iosBuild: null,
        displayText: expect.anything(),
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/project.basic.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp('xml', [{
          file: 'project-xml-strings.xml',
          target: 'resources/string[@name="app_name"]',
          replace: '<string name="app_name">Awesome App</string>\n'
        }]),
        makeOp('json', [{
          file: 'project-json.json',
          set: {
            project_info: {
              project_id: 'asdf'
            }
          }
        }])
      ] as Operation[]);
    });
  });

  describe('Android', () => {
    it('should process android operations', async () => {
      const makeOp = (name: string, value: any): Operation => ({
        id: `android.${name}`,
        platform: 'android',
        name,
        value,
        iosTarget: null,
        iosBuild: null,
        displayText: expect.anything(),
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/android.basic.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp('packageName', 'com.ionicframework.awesomePackage'),
        makeOp('versionName', '1.2.3'),
        makeOp('incrementVersionCode', true),
      ] as Operation[]);
    });
  });

  describe('iOS', () => {
    it('should process ios operations with targets and build', async () => {
      const makeOp = (name: string, value: any): Operation => ({
        id: `ios.${name}`,
        platform: 'ios',
        name,
        iosTarget: 'App',
        iosBuild: 'Debug',
        value,
        displayText: expect.anything(),
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/ios.targets.builds.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp('bundleId', 'com.ionicframework.testBundle'),
        makeOp('version', 16.4),
        makeOp('incrementBuild', true),
        makeOp('productName', 'Awesome App'),
        makeOp('displayName', 'My Awesome App'),
      ] as Operation[]);
    });

    it('should process ios operations with targets and no builds', async () => {
      const makeOp = (name: string, value: any): Operation => ({
        id: `ios.${name}`,
        platform: 'ios',
        name,
        iosTarget: 'App',
        iosBuild: null,
        value,
        displayText: expect.anything(),
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/ios.targets.nobuilds.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp('bundleId', 'com.ionicframework.testBundle'),
        makeOp('version', 16.4),
        makeOp('incrementBuild', true),
        makeOp('productName', 'Awesome App'),
        makeOp('displayName', 'My Awesome App'),
      ] as Operation[]);
    });

    it('should process ios operations with no targets and no builds', async () => {
      const makeOp = (name: string, value: any): Operation => ({
        id: `ios.${name}`,
        platform: 'ios',
        name,
        value,
        iosTarget: null,
        iosBuild: null,
        displayText: expect.anything(),
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/ios.notargets.nobuilds.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp('bundleId', 'com.ionicframework.testBundle'),
        makeOp('version', 16.4),
        makeOp('incrementBuild', true),
        makeOp('productName', 'Awesome App'),
        makeOp('displayName', 'My Awesome App'),
      ] as Operation[]);
    });
  });
});
