import { loadContext } from '../../src/ctx';
import { runCommand } from '../../src/tasks/run';

describe('task: run', () => {
  it('should run operations', async () => {
    const ctx = await loadContext('../common/test/fixtures');
    ctx.args.y = true;
    ctx.args.quiet = true;
    ctx.args.noCommit = true;

    await runCommand(ctx, '../common/test/fixtures/basic.yml');

    const files = ctx.project.vfs.all();

    expect(files).toEqual({
      '../common/test/fixtures/android/build.gradle': expect.anything(),
      '../common/test/fixtures/android/app/build.gradle': expect.anything(),
      '../common/test/fixtures/ios/App/App.xcodeproj/project.pbxproj': expect.anything(),
      '../common/test/fixtures/ios/App/App/App.entitlements': expect.anything(),
      '../common/test/fixtures/ios/App/App/Info.plist': expect.anything(),
      '../common/test/fixtures/ios/App/My App Clip/AppClip.plist': expect.anything(),
    });
  });
});