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

    const modified = ctx.project.vfs.all();
    console.log(modified);
  });
});