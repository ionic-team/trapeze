import chalk from 'chalk';
import yaml from 'yaml';

import ionicFs from '@ionic/utils-fs';
import { log, fatal } from '../log.mjs';

export async function runCommand(env, config, configFile) {
  try {
    log('Loading file', configFile);
    const contents = await ionicFs.readFile(configFile, { encoding: 'utf-8' });
    const parsed = yaml.parse(contents);

    console.log('Parsed yaml', JSON.stringify(parsed, null, 2));
  } catch (e) {
    fatal('Unable to load config file', e);
  }
}
