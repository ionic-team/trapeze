import yaml from 'yaml';
import util from 'util';

import ionicFs from '@ionic/utils-fs';

import c from '../colors.mjs';
import { processOperations } from '../op.mjs';
import { debug, logger, log } from '../util/log.mjs';
import { logPrompt } from '../util/cli.mjs';

import executeAndroidPackage from '../operations/android/package.mjs';
import executeAndroidGradle from '../operations/android/gradle.mjs';
import executeIosBundleId from '../operations/ios/bundleId.mjs';
import executeIosFrameworks from '../operations/ios/frameworks.mjs';
import executeIosPlist from '../operations/ios/plist.mjs';

export async function runCommand(ctx, configFile) {
  try {
    const contents = await ionicFs.readFile(configFile, { encoding: 'utf-8' });
    const parsed = yaml.parse(contents, {
      prettyErrors: true,
    });

    debug('Parsed YAML');
    debug(JSON.stringify(parsed, null, 2));

    const processed = processOperations(parsed);

    // If not -y, confirm

    if (!ctx.args.dryRun && !ctx.args.y) {
      await previewOperations(ctx, processed);
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
  // Promise.all(
  // operations.map(op => {
  for (const op of operations) {
    printOp(op);

    switch (op.id) {
      case 'ios.plist':
        break;
      // await executeIosPlist(ctx, op);
      case 'ios.bundleId':
        await executeIosBundleId(ctx, op);
        break;
      case 'ios.frameworks':
        await executeIosFrameworks(ctx, op);
        break;
      case 'ios.build.gradle':
        // await executeAndroidGradle(ctx, op);
        break;
      case 'android.package':
        // await executeAndroidPackage(ctx, op);
        break;
    }
  }
  // );
}

function printOp(op) {
  const env = c.weak(`[${op.env}]`);
  const platform = c.success(c.strong(`[${op.platform}]`));
  const opName = c.strong(op.name);
  const opDisplay = op.displayText;
  log(env, platform, opName, opDisplay);
}
