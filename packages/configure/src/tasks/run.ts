import c from '../colors';
import { processOperations } from '../op';
import { logger, log, error, warn, debug } from '../util/log';
import { logPrompt } from '../util/cli';
import { loadYamlConfig, YamlFile } from '../yaml-config';
import { isOpRegistered, loadHandlers, OperationHandlers, runOperation } from '../operations/index';
import { Context } from '../ctx';
import { Operation } from '../definitions';
import { Logger, VFSDiff } from '@trapezedev/project';
import kleur from 'kleur';

export async function runCommand(ctx: Context, configFile: YamlFile) {
  let processed: Operation[];
  let handlers: OperationHandlers = await loadHandlers();

  printPlatformLoadErrors(ctx);

  try {
    const config = await loadYamlConfig(ctx, configFile);

    processed = processOperations(config);
  } catch (e) {
    logger.error(`Unable to load config file: ${(e as Error).message}`);
    throw e;
  }

  if (!processed.length) {
    warn('No operations to apply, exiting...');
    process.exit(0);
  }

  try {
    await executeOperations(ctx, handlers, processed);
  } catch (e) {
    throw e;
  }
}

// A platform project that fails to load stores the error instead of throwing, and every
// operation on it then fails with a misleading message, so report the real cause up front.
function printPlatformLoadErrors(ctx: Context) {
  const iosError = ctx.project.ios?.getError();
  if (iosError) {
    logger.error(`Unable to load the iOS project: ${iosError.message}`);
  }

  const androidError = ctx.project.android?.getError();
  if (androidError) {
    logger.error(`Unable to load the Android project: ${androidError.message}`);
  }
}

async function executeOperations(ctx: Context, handlers: OperationHandlers, operations: Operation[]) {
  for (const op of operations) {
    const skipped = isOperationSkipped(ctx, op);

    if (!ctx.args.quiet) {
      printOp(op, skipped);
    }

    if (skipped) {
      Logger.debug(`Skipping ${op.id} because ${op.platform} project does not exist`);
      continue;
    }

    if (!isOpRegistered(handlers, op.id)) {
      logger.warn(
        `Unsupported configuration option ${c.strong(op.id)}. Skipping`,
      );
      continue;
    }

    (await runOperation(ctx, handlers, op)) || [];
  }
  await checkModifiedFiles(ctx);
}

// Operations on the `project` platform always run, they don't target a native project
function isOperationSkipped(ctx: Context, op: Operation) {
  if (op.platform === 'project') {
    return false;
  }

  return op.platform === 'ios' ? !ctx.project.ios : !ctx.project.android;
}

function printOp(op: Operation, skipped: boolean) {
  // const env = c.weak(`[${op.env}]`);
  const tag = skipped ? c.weak(c.strong(`skip`)) : kleur.bold().magenta(`run`);
  const platform = c.success(c.strong(`${op.platform}`));
  const opName = c.strong(op.name);
  const opDisplay = op.displayText;
  log(tag, platform, opName, opDisplay);
}

async function printDiff(diff: VFSDiff) {
  const lines: string[] = diff.patch?.split(/\r?\n|\r/g) ?? [];

  console.log(lines.map(line => {
    switch (line[0]) {
      case "+": return c.success(line.trimEnd());
      case "-": return c.log.ERROR(line.trimEnd());
      default: return line.trimEnd();
    }
  }).join('\n'));
}

async function checkModifiedFiles(ctx: Context) {
  const files = ctx.project.vfs.modifiedFiles();
  const diffs = ctx.args.diff ? await ctx.project.vfs.diffAll() : [];

  files.map(file => {
    if (!ctx.args.quiet) {
      log(c.log.WARN(c.strong(`updated`)), file.getFilename());
    }
    const diff = diffs.find((d: any) => d.file === file);
    if (diff && ctx.args.diff) {
      printDiff(diff);
    }
  });

  // commander sets `commit` to false when --no-commit is passed
  if (ctx.args.commit === false) {
    return;
  }

  if (!ctx.args.dryRun && !ctx.args.y) {
    const answers = await logPrompt(
      c.strong(`Apply changes?\n`) +
        `Applying these changes will modify your source files. We recommend committing any changes before running this operation.`,
      {
        type: 'confirm',
        name: 'apply',
        message: `Apply?`,
        initial: false,
      },
    );

    if (answers.apply) {
      return ctx.project.vfs.commitAll(ctx.project);
    } else {
      log('Not applying changes. Exiting');
    }
  } else if (!ctx.args.dryRun && ctx.args.y) {
    if (!ctx.args.quiet) {
      logger.info('-y provided, automatically applying configuration');
    }
    return ctx.project.vfs.commitAll(ctx.project);
  }
}
