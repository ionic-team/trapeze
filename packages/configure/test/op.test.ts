import { Context, loadContext } from '../src/ctx';
import { loadYamlConfig } from '../src/yaml-config';
import { processOperations } from '../src/op';
import { Operation } from '../src/definitions';

describe('operation processing', () => {
  let ctx: Context;
  beforeEach(async () => {
    ctx = await loadContext('../common/test/fixtures');
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
