import c from '../colors';
import { processOperations } from '../op';
import { logger, log, error, warn } from '../util/log';
import { logPrompt } from '../util/cli';
import { loadYamlConfig, YamlFile } from '../yaml-config';
import { hasHandler, runOperation } from '../operations/index';
import { Context } from '../ctx';
import { Operation } from '../definitions';
import { VFSDiff } from '@trapezedev/project';

export async function runCommand(ctx: Context, configFile: YamlFile) {
  let processed: Operation[];
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
    await executeOperations(ctx, processed);
  } catch (e) {
    throw e;
  }
}

async function executeOperations(ctx: Context, operations: Operation[]) {
  for (const op of operations) {
    if (!ctx.args.quiet) {
      printOp(op);
    }

    if (!hasHandler(op)) {
      logger.warn(
        `Unsupported configuration option ${c.strong(op.id)}. Skipping`,
      );
      continue;
    }

    (await runOperation(ctx, op)) || [];
  }
  await checkModifiedFiles(ctx);
}

function printOp(op: Operation) {
  // const env = c.weak(`[${op.env}]`);
  const tag = c.weak(c.strong(`run`));
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
  const files = ctx.project.vfs.all();
  const diffs = ctx.args.diff ? await ctx.project.vfs.diffAll() : [];

  Object.keys(files).map(k => {
    const file = files[k];
    log(c.log.WARN(c.strong(`updated`)), file.getFilename());
    const diff = diffs.find(d => d.file === file);
    if (diff && ctx.args.diff) {
      printDiff(diff);
    }
  });

  if (ctx.args.noCommit) {
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
      return ctx.project.vfs.commitAll();
    } else {
      log('Not applying changes. Exiting');
    }
  } else if (!ctx.args.dryRun && ctx.args.y) {
    logger.info('-y provided, automatically applying configuration');
    return ctx.project.vfs.commitAll();
  }
}
