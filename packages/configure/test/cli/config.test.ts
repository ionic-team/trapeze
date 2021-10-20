import { loadContext } from '../../cli/ctx';
import { loadConfig } from '../../cli/config';

describe('config loading', () => {
  let ctx;
  beforeEach(async () => {
    ctx = await loadContext('test/fixtures');
  });

  it('should load config file', async () => {
    const parsed = await loadConfig(ctx, 'test/fixtures/ios.targets.builds.yml');
    expect(parsed).not.toBeUndefined();
  });
});