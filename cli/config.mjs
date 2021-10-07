import chalk from "chalk";
import { join } from "path";
import { pathExists } from "@ionic/utils-fs";

import { requireTS } from "./util/node.mjs";
import { log } from "./log.mjs";

const defaultConfig = {};

export async function loadConfig(env) {
  const { rootDir } = env;

  const configFile = join(rootDir, env.configFile);

  if (!(await pathExists(configFile))) {
    log(chalk`No {bold ${env.configFile}} found, using defaults.`);
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
    console.error(chalk`Unable to load config file: {red.bold ${e.message}}`);
    throw e;
  }
}
