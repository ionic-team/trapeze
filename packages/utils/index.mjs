import { Argument, program } from 'commander';

program
  .command('new-op')
  .argument('[name]', 'op name')
  .addArgument(new Argument('[platform]', 'op platform').choices(['ios', 'android', 'platform']))
  .action(async (name, platform) => {
    const run = await import('./src/new-op.mjs');
    run.default({ name, platform });
  });

program.parse();