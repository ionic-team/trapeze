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
});
