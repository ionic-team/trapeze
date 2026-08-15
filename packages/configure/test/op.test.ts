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

  describe('Display text', () => {
    it('should count every plist entry, not the list of entry groups', async () => {
      const processed = processOperations({
        platforms: {
          ios: {
            targets: {
              App: {
                plist: [
                  { replace: true, entries: [{ UIRequiresFullScreen: true }] },
                  { entries: [{ NSFaceIDUsageDescription: 'Log in' }] },
                ],
              },
            },
          },
        },
      });

      expect(processed[0].displayText).toBe('2 modifications');
    });

    it('should count the plist entries of the legacy object form', async () => {
      const processed = processOperations({
        platforms: {
          ios: {
            targets: {
              App: {
                plist: { entries: [{ UIRequiresFullScreen: true }] },
              },
            },
          },
        },
      });

      expect(processed[0].displayText).toBe('1 modification');
    });
  });

  describe('Project', () => {
    it('should process project operations', async () => {
      const makeOp = (
        name: string,
        value: any,
        displayText: any = expect.anything(),
      ): Operation => ({
        id: `project.${name}`,
        platform: 'project',
        name,
        value,
        iosTarget: null,
        iosBuild: null,
        displayText,
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
        }], '1 modification'),
        makeOp('json', [{
          file: 'project-json.json',
          set: {
            project_info: {
              project_id: 'asdf'
            }
          }
        }], '1 modification')
      ] as Operation[]);
    });
  });

  describe('Android', () => {
    it('should process android operations', async () => {
      const makeOp = (
        name: string,
        value: any,
        displayText: any = expect.anything(),
      ): Operation => ({
        id: `android.${name}`,
        platform: 'android',
        name,
        value,
        iosTarget: null,
        iosBuild: null,
        displayText,
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/android.basic.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp(
          'packageName',
          'com.ionicframework.awesomePackage',
          'com.ionicframework.awesomePackage',
        ),
        makeOp('versionName', '1.2.3', '1.2.3'),
        makeOp('incrementVersionCode', true),
      ] as Operation[]);
    });
  });

  describe('iOS', () => {
    it('should process ios operations with targets and build', async () => {
      const makeOp = (
        name: string,
        value: any,
        displayText: any = expect.anything(),
      ): Operation => ({
        id: `ios.${name}`,
        platform: 'ios',
        name,
        iosTarget: 'App',
        iosBuild: 'Debug',
        value,
        displayText,
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/ios.targets.builds.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp('bundleId', 'com.ionicframework.testBundle', 'com.ionicframework.testBundle'),
        makeOp('version', 16.4),
        makeOp('incrementBuild', true),
        makeOp('productName', 'Awesome App', 'Awesome App'),
        makeOp('displayName', 'My Awesome App', 'My Awesome App'),
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

    it('should process ios operations defined next to targets and builds', async () => {
      const makeOp = (
        name: string,
        value: any,
        iosTarget: string | null,
        iosBuild: string | null,
      ): Operation => ({
        id: `ios.${name}`,
        platform: 'ios',
        name,
        iosTarget,
        iosBuild,
        value,
        displayText: expect.anything(),
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/ios.shared.targets.builds.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp('bundleId', 'com.ionicframework.testBundle', null, null),
        makeOp('version', 16.4, 'App', null),
        makeOp('displayName', 'My Awesome App', 'App', 'Debug'),
      ] as Operation[]);
    });

    it('should process ios operations shared through yaml merge keys', async () => {
      const makeOp = (
        name: string,
        value: any,
        iosBuild: string,
      ): Operation => ({
        id: `ios.${name}`,
        platform: 'ios',
        name,
        iosTarget: 'App',
        iosBuild,
        value,
        displayText: expect.anything(),
      });
      const parsed = await loadYamlConfig(
        ctx,
        '../common/test/fixtures/ios.merge.keys.yml',
      );

      const processed = processOperations(parsed);

      expect(processed).toMatchObject([
        makeOp('bundleId', 'com.ionicframework.testBundle', 'Debug'),
        makeOp('bundleId', 'com.ionicframework.testBundle', 'Release'),
        makeOp('displayName', 'My Awesome App', 'Release'),
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
