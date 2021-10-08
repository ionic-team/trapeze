import yaml from 'yaml';
import util from 'util';

import ionicFs from '@ionic/utils-fs';

import c from '../colors.mjs';
import { logger, log } from '../util/log.mjs';
import { processOperations } from '../op.mjs';

import executePackage from '../operations/android/package.mjs';
import executeGradle from '../operations/android/gradle.mjs';
import { logPrompt } from '../util/cli.mjs';

export async function runCommand(ctx, configFile) {
  try {
    const contents = await ionicFs.readFile(configFile, { encoding: 'utf-8' });
    const parsed = yaml.parse(contents, {
      prettyErrors: true,
    });

    logger.debug('Parsed YAML');
    logger.debug(JSON.stringify(parsed, null, 2));

    const processed = processOperations(parsed);

    await previewOperations(ctx, processed);

    // If not -y, confirm
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
  } catch (e) {
    logger.error('Unable to load config file', e);
    throw e;
  }
}

async function previewOperations(ctx, operations) {
  for (let op of operations) {
    printOp(op);
  }
}

async function executeOperations(ctx, operations) {
  for (let op of operations) {
    printOp(op);

    switch (op.name) {
      case 'build.gradle':
        return executeGradle(ctx, op);
      case 'package':
        return executePackage(ctx, op);
    }
  }
}

function printOp(op) {
  const env = c.ancillary(`[${op.env}]`);
  const platform = c.weak(c.strong(`[${op.platform}]`));
  const opName = c.strong(op.name);
  const opDisplay = op.displayText;
  log(env, platform, opName, opDisplay);
}
