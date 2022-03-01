import { Context, loadContext } from '../src/ctx';
import { loadConfig } from '../src/config';

describe('context and capacitor project loading', () => {
  let ctx: Context;
  it('should load capacitor configuration', async () => {
    ctx = await loadContext('../common/test/fixtures/ios-and-android');
    expect(ctx.project.config?.ios?.path).toBe('ios');
    expect(ctx.project.config?.android?.path).toBe('android');
  });

  it('should load capacitor configuration with customer dir', async () => {
    ctx = await loadContext('../common/test/fixtures/custom-platform-directories');
    expect(ctx.project.config?.ios?.path).toBe('my-ios-app');
    expect(ctx.project.config?.android?.path).toBe('my-android-app');
  });
});