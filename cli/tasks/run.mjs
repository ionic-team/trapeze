import chalk from 'chalk';
import yaml from 'yaml';
import util from 'util';

import ionicFs from '@ionic/utils-fs';
import { debug, log, fatal } from '../log.mjs';
import { processOperations } from '../op.mjs';

export async function runCommand(env, config, configFile) {
  try {
    const contents = await ionicFs.readFile(configFile, { encoding: 'utf-8' });
    const parsed = yaml.parse(contents, {
      prettyErrors: true,
    });

    debug('Parsed YAML');
    debug(JSON.stringify(parsed, null, 2));

    const processed = processOperations(parsed);

    await executeOperations(processed);
  } catch (e) {
    fatal('Unable to load config file', e);
  }
}

async function executeOperations(operations) {
  for (let op of operations) {
    printOp(op);
  }
}

function printOp(op) {
  const env = chalk`{yellow.bold [${op.env}]}`;
  const platform = chalk.green(chalk.bold(`[${op.platform}]`));
  const opName = chalk`{bold ${op.name}}`;
  const opDisplay = op.displayText;
  console.log(env, platform, opName, opDisplay);
}
