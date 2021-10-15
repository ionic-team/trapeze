import c from '../colors';
import { processOperations } from '../op';
import { logger, log, error } from '../util/log';
import { logPrompt } from '../util/cli';
import { loadConfig } from '../config';
import { hasHandler, runOperation } from '../operations/index';

export async function runCommand(ctx, configFile) {
  let processed;
  try {
    const config = await loadConfig(ctx, configFile);

    processed = processOperations(config);
  } catch (e) {
    logger.error(`Unable to load config file: ${e.message}`);
    throw e;
  }

  try {
    // If not -y, confirm

    if (!ctx.args.dryRun && !ctx.args.y) {
      await previewOperations(processed);
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
        await executeOperations(ctx, processed);
      }
    } else if (!ctx.args.dryRun && ctx.args.y) {
      logger.info('-y provided, automatically applying configuration');
      console.log(processed.length);
      await executeOperations(ctx, processed);
    }
  } catch (e) {
    error('Unable to apply changes', e);
    throw e;
  }
}

async function previewOperations(operations) {
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

async function executeOperations(ctx, operations) {
  for (const op of operations) {
    printOp(op);
    if (!hasHandler(op)) {
      logger.warn(
        `Unsupported configuration option ${c.strong(op.id)}. Skipping`,
      );
      continue;
    }
    const changes = await runOperation(ctx, op);
    // TODO: Apply changes
    // console.log('CHANGES', changes);
  }
}

function printOp(op) {
  // const env = c.weak(`[${op.env}]`);
  const platform = c.success(c.strong(`${op.platform}`));
  const opName = c.strong(op.name);
  const opDisplay = op.displayText;
  log(platform, opName, opDisplay);
}
