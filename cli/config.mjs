import { join } from 'path';
import { pathExists } from '@ionic/utils-fs';

import { requireTS } from './util/node.mjs';
import { logger } from './util/log.mjs';
import c from './colors.mjs';

const defaultConfig = {};

export async function loadConfig(env) {
  const { rootDir } = env;

  const configFile = join(rootDir, env.configFile);

  if (!(await pathExists(configFile))) {
    logger.warn(`No ${colors.strong(env.configFile)} found, using defaults.`);
    return { ...defaultConfig };
  }

  try {
    const m = requireTS(env.configFile);

    const config = m.default ? m.default : m;

    return {
      ...defaultConfig,
      ...(config || {}),
    };
  } catch (e) {
    logger.error(
      colors.strong(`Unable to load config file: ${colors.failure(e.message)}`),
    );
    throw e;
  }
}
