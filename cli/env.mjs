import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { resolve } from 'path';
import ionicFs from '@ionic/utils-fs';

export async function loadEnv() {
  const rootDir = process.cwd();

  const argv = yargs(hideBin(process.argv)).argv;
  return {
    args: argv,
    rootDir,
  };
}

export function setArguments(ctx, args) {
  ctx.args = args;
  process.env.VERBOSE = !!args.verbose;
}
