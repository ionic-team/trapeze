import yargs from 'yargs';
import { join } from 'path';
import { hideBin } from 'yargs/helpers';
import url from 'url';

export async function loadContext() {
  const rootDir = process.cwd();

  const argv = yargs(hideBin(process.argv)).argv;
  return {
    args: argv,
    vars: {},
    // nodePackageRoot: url.fileURLToPath(join(import.meta.url, '../../')),
    nodePackageRoot: join(__dirname, '../'),
    rootDir,
  };
}

export function setArguments(ctx, args) {
  ctx.args = args;
  process.env.VERBOSE = '' + !!args.verbose;
}

// Given a variable of the form $VARIABLE, resolve the
// actual value from the environment
export function str(ctx, s) {
  // Replace any variables in the string, ignoring
  // ones of the type $(blah) which are handled by the platform (i.e. iOS)
  s = s.replace(/\$[^\(][\w]+/g, m => {
    const foundVar = ctx.vars[m.slice(1)];

    if (foundVar) {
      return foundVar.value || '';
    } else if (foundVar === null) {
      return '';
    }
  });

  return s;
}

// Given a list of vars from our configuration, initialize
// any that are already found in the process env
export function initVarsFromEnv(ctx, vars) {
  for (const v in vars) {
    const existing = process.env[v];
    if (existing) {
      ctx.vars[v] = {
        value: existing,
      };
    }
  }
}

function getInitialVars() {
  return {};
}
