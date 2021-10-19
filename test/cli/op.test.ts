import { loadContext } from '../../cli/ctx';
import { loadConfig } from '../../cli/config';
import { AndroidOperation, IosOperation, processOperations } from '../../cli/op';

describe('operation processing', () => {
  let ctx;
  beforeEach(async () => {
    ctx = await loadContext();
  });

  it('should process android operations', async () => {
    const makeOp = (name, value): AndroidOperation => ({
      id: `android.${name}`,
      platform: 'android',
      name,
      value,
      displayText: expect.anything()
    });
    const parsed = await loadConfig(ctx, 'test/fixtures/android.basic.yml');

    const processed = processOperations(parsed);

    expect(processed).toMatchObject([
      makeOp('packageName', 'com.ionicframework.awesomePackage'),
      makeOp('versionName', '1.2.3'),
      makeOp('incrementVersionCode', true),
    ] as IosOperation[]);
  });

  it('should process ios operations with targets and build', async () => {
    const makeOp = (name, value): IosOperation => ({
      id: `ios.${name}`,
      platform: 'ios',
      name,
      target: 'App',
      build: 'Debug',
      value,
      displayText: expect.anything()
    });
    const parsed = await loadConfig(ctx, 'test/fixtures/ios.targets.builds.yml');

    const processed = processOperations(parsed);

    expect(processed).toMatchObject([
      makeOp('bundleId', 'com.ionicframework.testBundle'),
      makeOp('version', 16.4),
      makeOp('incrementBuild', true),
      makeOp('productName', 'Awesome App'),
      makeOp('displayName', 'My Awesome App')
    ] as IosOperation[]);
  });

  it('should process ios operations with targets and no builds', async () => {
    const makeOp = (name, value): IosOperation => ({
      id: `ios.${name}`,
      platform: 'ios',
      name,
      target: 'App',
      value,
      displayText: expect.anything()
    });
    const parsed = await loadConfig(ctx, 'test/fixtures/ios.targets.nobuilds.yml');

    const processed = processOperations(parsed);

    expect(processed).toMatchObject([
      makeOp('bundleId', 'com.ionicframework.testBundle'),
      makeOp('version', 16.4),
      makeOp('incrementBuild', true),
      makeOp('productName', 'Awesome App'),
      makeOp('displayName', 'My Awesome App')
    ] as IosOperation[]);
  });

  it('should process ios operations with no targets and no builds', async () => {
    const makeOp = (name, value): IosOperation => ({
      id: `ios.${name}`,
      platform: 'ios',
      name,
      value,
      displayText: expect.anything()
    });
    const parsed = await loadConfig(ctx, 'test/fixtures/ios.notargets.nobuilds.yml');

    const processed = processOperations(parsed);

    expect(processed).toMatchObject([
      makeOp('bundleId', 'com.ionicframework.testBundle'),
      makeOp('version', 16.4),
      makeOp('incrementBuild', true),
      makeOp('productName', 'Awesome App'),
      makeOp('displayName', 'My Awesome App')
    ] as IosOperation[]);
  });
});