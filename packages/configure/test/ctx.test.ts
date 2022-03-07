import { join } from 'path';
import { Context, loadContext } from '../src/ctx';
import { loadConfig } from '../src/config';

describe('context and capacitor project loading', () => {
  let ctx: Context;
  it('should load capacitor configuration', async () => {
    const dir = '../common/test/fixtures/ios-and-android';
    ctx = await loadContext(dir)
    expect(ctx.project.android).not.toBe(null);
    expect(ctx.project.ios).not.toBe(null);
    expect(ctx.project.config?.ios?.path).toBe(join(dir, 'ios'));
    expect(ctx.project.config?.android?.path).toBe(join(dir, 'android'));
  });

  it('should load capacitor configuration with custom dir', async () => {
    const dir = '../common/test/fixtures/custom-platform-directories';
    ctx = await loadContext(dir);
    expect(ctx.project.android).not.toBe(null);
    expect(ctx.project.ios).not.toBe(null);
    expect(ctx.project.config?.ios?.path).toBe(join(dir, 'my-ios-app'));
    expect(ctx.project.config?.android?.path).toBe(join(dir, 'my-android-app'));
  });
});