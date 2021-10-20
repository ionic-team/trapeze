import { Context, loadContext } from '../../../cli/ctx';
import { runCommand } from '../../../cli/tasks/run';

describe('task: run', () => {
  let ctx: Context;
  beforeEach(async () => {
    ctx = await loadContext('test/fixtures');
    ctx.args.y = true;
  });

  it.only('should run operations', async () => {
    await runCommand(ctx, 'test/fixtures/basic.yml');

    const files = ctx.project.vfs.all();

    expect(files).toMatchObject({
      'test/fixtures/ios/App/App.xcodeproj/project.pbxproj': expect.anything(),
      'test/fixtures/ios/App/App/App.entitlements': expect.anything(),
      'test/fixtures/ios/App/App/Info.plist': expect.anything(),
      'test/fixtures/ios/App/My App Clip/AppClip.plist': expect.anything(),
    });
  });
});