import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { resolve } from "path";
import ionicFs from "@ionic/utils-fs";

export async function loadEnv() {
  const rootDir = process.cwd();

  const argv = yargs(hideBin(process.argv)).argv;
  return {
    args: argv,
    configFile: "capacitor.config.ts",
    cachePath: ".ionic",
    // package: await ionicFs.readJSON(resolve(rootDir, "package.json")),
    rootDir,
  };
}

export function getConfigurations(env) {
  return env.args._;
}

export function hasConfiguration(env, configName) {
  return !!env.args._.find((c) => c === configName);
}
