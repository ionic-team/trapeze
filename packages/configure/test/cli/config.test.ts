import { Context, loadContext } from '../../src/ctx';
import { loadConfig } from '../../src/config';

describe('config loading', () => {
  let ctx: Context;
  beforeEach(async () => {
    ctx = await loadContext('test/fixtures');
  });

  it('should load config file', async () => {
    const parsed = await loadConfig(ctx, 'test/fixtures/ios.targets.builds.yml');
    expect(parsed).not.toBeUndefined();
  });
});