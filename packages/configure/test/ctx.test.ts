import { join } from 'path';
import { Context, initVarsFromEnv, loadContext, str, Variables, VariableType } from '../src/ctx';

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
    process.env.THING2 = '0';
    process.env.THING3 = '[1, 2, 3, 4]';
    process.env.THING4 = '{ "foo": "bar" }';
    const vars: Variables = {
      'THING': {
        type: VariableType.Number
      },
      'THING2': {
        type: VariableType.String
      },
      'THING3': {
        type: VariableType.Array
      },
      'THING4': {
        type: VariableType.Object
      }
    }

    initVarsFromEnv(ctx, vars);

    expect(ctx.vars).toMatchObject({
      'THING': {
        value: 0,
      },
      'THING2': {
        value: '0',
      },
      'THING3': {
        value: [1, 2, 3, 4]
      },
      'THING4': {
        value: { "foo": "bar" }
      }
    });
  });

  it('shouldn\'t expand certain variable types', async () => {
    const dir = '../common/test/fixtures/ios-and-android';
    ctx = await loadContext(dir, 'android', 'ios/App');

    // Set the value of THING in the env, and register it as a variable
    process.env.THING = 'foo';
    const vars: Variables = {
      'THING': {
        type: VariableType.String,
      },
    }

    initVarsFromEnv(ctx, vars);

    // Make sure that only certain forms of the use of the variable are expanded
    const s = str(ctx, '$THING');
    expect(s).toBe('foo');

    const s2 = str(ctx, '$(THING)');
    expect(s2).toBe('$(THING)');

    const s3 = str(ctx, '${THING}');
    expect(s3).toBe('${THING}');
  });
});
