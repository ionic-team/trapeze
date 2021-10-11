import program from 'commander';
import { loadContext, setArguments } from './ctx.mjs';
import { logger } from './util/log.mjs';
import { wrapAction } from './util/cli.mjs';

export async function run() {
  try {
    const ctx = await loadContext();
    runProgram(ctx);
  } catch (e) {
    process.exitCode = 1;
    logger.error(e.message ? e.message : String(e));
    throw e;
  }
}

export function runProgram(ctx) {
  // program.version(env.package.version);

  program
    .command('run [configFile]')
    .description(`Run project modification`)
    .option('--dry-run', 'Show changes before making them')
    .option('-y', 'Non-interactive')
    .option('--verbose', 'Verbose output')
    .action(
      wrapAction(async (configFile, args = {}) => {
        setArguments(ctx, args);

        const { runCommand } = await import('./tasks/run.mjs');
        await runCommand(ctx, configFile);
      }),
    );

  program.arguments('[command]').action(
    wrapAction(_ => {
      program.outputHelp();
    }),
  );

  program.parse(process.argv);
}
