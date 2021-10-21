import { Context, loadContext } from '../src/ctx';
import { loadConfig } from '../src/config';

describe('config loading', () => {
  let ctx: Context;
  beforeEach(async () => {
    ctx = await loadContext('../common/test/fixtures');
  });

  it('should load config file', async () => {
    const parsed = await loadConfig(ctx, '../common/test/fixtures/ios.targets.builds.yml');
    expect(parsed).not.toBeUndefined();
  });
});