import { Command } from 'commander';
import { Context, initLogging, loadContext, setArguments } from './ctx';
import { fatal, logger } from './util/log';
import { wrapAction } from './util/cli';

const { version } = require('../package.json');

export async function run() {
  try {
    initLogging(process.argv);
    const ctx = await loadContext();
    runProgram(ctx);
  } catch (e: any) {
    process.exitCode = 1;
    logger.error(e.message ? e.message : String(e));
    throw e;
  }
}

export function runProgram(ctx: Context) {
  createProgram(ctx).parse(process.argv);
}

export function createProgram(ctx: Context) {
  const program = new Command();

  program.version(version);

  program
    .command('run [configFile]')
    .description(`Run project modification`)
    .option('--dry-run', 'Show changes before making them')
    .option('-y', 'Non-interactive')
    .option('--no-commit', 'Show the changes but do not write them to disk')
    .option('--diff', 'Show a diff of each file')
    .option('--verbose', 'Verbose output')
    .option('--quiet', 'Only print warnings and errors')
    .option('--project-root <path>', 'Path to the root of the project (default: the current directory)')
    .option('--android-project <path>', 'Path to the root of the Android project (default: \'android\')')
    .option('--ios-project <path>', 'Path to the root of the iOS project (default: \'ios/App\')')
    .option('--ios', 'Explicitly run iOS operations. This is exclusive, meaning other platforms not specified won\'t run when this flag is used')
    .option('--android', 'Explicitly run Android operations. This is exclusive, meaning other platforms not specified won\'t run when this flag is used')
    .action(
      wrapAction(async (configFile: string, args = {}) => {
        setArguments(ctx, args);

        const { runCommand } = await import('./tasks/run');
        try {
          await runCommand(ctx, configFile);
        } catch (e) {
          fatal('Error running command', e as Error);
        }
      }),
    );

  program.addHelpCommand();
  program.arguments('[command]').action(
    wrapAction((_: any) => {
      program.outputHelp();
    }),
  );

  return program;
}
