import c from '../colors.mjs';
import { processOperations } from '../op.mjs';
import { debug, logger, log } from '../util/log.mjs';
import { logPrompt } from '../util/cli.mjs';
import { loadConfig } from '../config.mjs';

import executeAndroidPackage from '../operations/android/package.mjs';
import executeAndroidGradle from '../operations/android/gradle.mjs';
import executeAndroidRes from '../operations/android/res.mjs';
import executeIosBundleId from '../operations/ios/bundleId.mjs';
import executeIosFrameworks from '../operations/ios/frameworks.mjs';
import executeIosEntitlements from '../operations/ios/entitlements.mjs';
import executeIosPlist from '../operations/ios/plist.mjs';

export async function runCommand(ctx, configFile) {
  try {
    const config = await loadConfig(ctx, configFile);

    const processed = processOperations(config);

    console.log('Processed', processed);

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
        await executeIosPlist(ctx, op);
        break;
      case 'ios.bundleId':
        await executeIosBundleId(ctx, op);
        break;
      case 'ios.frameworks':
        await executeIosFrameworks(ctx, op);
        break;
      case 'ios.entitlements':
        await executeIosEntitlements(ctx, op);
        break;
      case 'ios.build.gradle':
        // await executeAndroidGradle(ctx, op);
        break;
      case 'android.package':
        await executeAndroidPackage(ctx, op);
        break;
      case 'android.res':
        await executeAndroidRes(ctx, op);
        break;
    }
  }
  // );
}

function printOp(op) {
  // const env = c.weak(`[${op.env}]`);
  const platform = c.success(c.strong(`[${op.platform}]`));
  const opName = c.strong(op.name);
  const opDisplay = op.displayText;
  log(platform, opName, opDisplay);
}
