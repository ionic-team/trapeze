import { Context, loadContext } from '../src/ctx';
import { loadYamlConfig } from '../src/yaml-config';

describe('config loading', () => {
  let ctx: Context;
  beforeEach(async () => {
    ctx = await loadContext('../common/test/fixtures');
  });

  it('should load config file', async () => {
    const parsed = await loadYamlConfig(
      ctx,
      '../common/test/fixtures/ios.targets.builds.yml',
    );
    expect(parsed).not.toBeUndefined();
  });

  it('should interpolate variables used as map keys', async () => {
    const parsed = await loadYamlConfig(
      ctx,
      '../common/test/fixtures/ios.var.keys.yml',
    );

    expect(parsed.platforms.ios.targets.App.plist[0].entries[0]).toEqual({
      provisioningProfiles: {
        'com.ionicframework.testBundle': 'My iOS Profile',
      },
    });
  });

  it('should serialize JSON-valued variables used as map keys', async () => {
    const parsed = await loadYamlConfig(
      ctx,
      '../common/test/fixtures/ios.var.keys.yml',
    );

    expect(parsed.platforms.ios.targets.App.plist[0].entries[1]).toEqual({
      serializedKeys: {
        '{"com.ionicframework.testBundle":"My iOS Profile"}': 'My iOS Profiles',
      },
    });
  });

  it('should only interpolate map keys whose variables are all declared', async () => {
    const parsed = await loadYamlConfig(
      ctx,
      '../common/test/fixtures/ios.var.keys.yml',
    );

    expect(parsed.platforms.ios.targets.App.plist[0].entries[2]).toEqual({
      literalKeys: {
        // Not a variable reference, so it has to survive as written
        $schema: './schema.json',
        'prefix_com.ionicframework.testBundle': 'Interpolated',
        'prefix_$UNDECLARED': 'Literal',
      },
    });
  });

  it('should keep variable declarations intact', async () => {
    const parsed = await loadYamlConfig(
      ctx,
      '../common/test/fixtures/ios.var.keys.yml',
    );

    expect(parsed.vars).toMatchObject({
      BUNDLE_ID: { default: 'com.ionicframework.testBundle' },
      PROFILE: { default: 'My iOS Profile' },
    });
  });
});
