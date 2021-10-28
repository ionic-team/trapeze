import c from '../colors';
import { processOperations } from '../op';
import { logger, log, error, warn } from '../util/log';
import { logPrompt } from '../util/cli';
import { loadConfig, YamlFile } from '../config';
import { hasHandler, runOperation } from '../operations/index';
import { Context } from '../ctx';
import { Operation } from '../definitions';
import { VFSRef } from '@capacitor/project/dist/vfs';

export async function runCommand(ctx: Context, configFile: YamlFile) {
  let processed: Operation[];
  try {
    const config = await loadConfig(ctx, configFile);

    processed = processOperations(config);
  } catch (e: any) {
    logger.error(`Unable to load config file: ${e.message}`);
    throw e;
  }

  if (!processed.length) {
    warn('No operations to apply, exiting...');
    process.exit(0);
  }

  try {
    await executeOperations(ctx, processed);
  } catch (e) {
    error('Unable to apply changes', e);
    throw e;
  }
}

/*
async function previewOperations(operations: Operation[]) {
  for (let op of operations) {
    printOp(op);

    if (!hasHandler(op)) {
      throw new Error(
        `Unsupported configuration option ${c.strong(
          op.id,
        )}. Check your configuration file and fix any issues before running again`,
      );
    }
  }
}
*/

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

    await runOperation(ctx, op) || [];
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

async function checkModifiedFiles(ctx: Context) {
  const files = ctx.project.vfs.all();
  Object.keys(files).map(k => {
    const file = files[k];
    log(c.log.WARN(c.strong(`updated`)), file.getFilename());
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
      ctx.project.vfs.commitAll();
    } else {
      log('Not applying changes. Exiting');
    }
  } else if (!ctx.args.dryRun && ctx.args.y) {
    logger.info('-y provided, automatically applying configuration');
    ctx.project.vfs.commitAll();
  }
}