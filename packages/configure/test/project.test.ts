import { Args } from '../src/ctx';
import { loadProject } from '../src/project';

describe('project loading', () => {
  const dir = '../common/test/fixtures/ios-and-android';

  // --ios and --android select the platforms to configure. Passing neither, or both,
  // enables both platforms
  const platformSelections: [Args, boolean, boolean][] = [
    [{}, true, true],
    [{ ios: true }, true, false],
    [{ android: true }, false, true],
    [{ ios: true, android: true }, true, true],
  ];

  it.each(platformSelections)(
    'should enable the platforms selected by %o',
    async (args, iosEnabled, androidEnabled) => {
      const project = await loadProject(args, dir, 'android', 'ios/App');

      expect(!!project.ios).toBe(iosEnabled);
      expect(!!project.android).toBe(androidEnabled);
    },
  );

  it('should not require a platform that was not selected', async () => {
    const iosOnlyDir = '../common/test/fixtures/ios-only';

    await expect(loadProject({}, iosOnlyDir, 'android', 'ios/App')).rejects.toThrow(
      /Unable to find Android project/,
    );

    const project = await loadProject({ ios: true }, iosOnlyDir, 'android', 'ios/App');
    expect(project.android).toBeNull();
    expect(project.ios).not.toBeNull();
  });
});
