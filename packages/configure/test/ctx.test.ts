import { join } from 'path';
import { Context, initVarsFromEnv, loadContext, Variables } from '../src/ctx';

describe('context and capacitor project loading', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  let ctx: Context;
  it('should load capacitor configuration', async () => {
    const dir = '../common/test/fixtures/ios-and-android';
    ctx = await loadContext(dir, 'android', 'ios/App');
    expect(ctx.project.android).not.toBe(null);
    expect(ctx.project.ios).not.toBe(null);
    expect(ctx.project.config?.ios?.path).toBe(join(dir, 'ios', 'App'));
    expect(ctx.project.config?.android?.path).toBe(join(dir, 'android'));
  });

  it('should load capacitor configuration with custom dir', async () => {
    const dir = '../common/test/fixtures/custom-platform-directories';
    ctx = await loadContext(dir, 'my-android-app', 'my-ios-app/App');
    expect(ctx.project.android).not.toBe(null);
    expect(ctx.project.ios).not.toBe(null);
    expect(ctx.project.config?.ios?.path).toBe(join(dir, 'my-ios-app', 'App'));
    expect(ctx.project.config?.android?.path).toBe(join(dir, 'my-android-app'));
  });

  it('should init vars', async () => {
    const dir = '../common/test/fixtures/ios-and-android';
    ctx = await loadContext(dir, 'android', 'ios/App');

    process.env.THING = '0';
    const vars: Variables = {
      'THING': {
        value: '0'
      }
    }

    initVarsFromEnv(ctx, vars);

    expect(ctx.vars).toMatchObject({
      'THING': {
        value: 0
      }
    });
  });
});
