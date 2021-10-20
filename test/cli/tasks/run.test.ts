import { Context, loadContext } from '../../../cli/ctx';
import { runCommand } from '../../../cli/tasks/run';

describe('task: run', () => {
  it.only('should run operations', async () => {
    const ctx = await loadContext('test/fixtures');
    ctx.args.y = true;
    ctx.args.quiet = true;
    ctx.args.noCommit = true;

    await runCommand(ctx, 'test/fixtures/basic.yml');

    const files = ctx.project.vfs.all();

    expect(files).toEqual({
      'test/fixtures/ios/App/App.xcodeproj/project.pbxproj': expect.anything(),
      'test/fixtures/ios/App/App/App.entitlements': expect.anything(),
      'test/fixtures/ios/App/App/Info.plist': expect.anything(),
      'test/fixtures/ios/App/My App Clip/AppClip.plist': expect.anything(),
    });
  });
});