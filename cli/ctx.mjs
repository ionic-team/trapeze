import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export async function loadContext() {
  const rootDir = process.cwd();

  const argv = yargs(hideBin(process.argv)).argv;
  return {
    args: argv,
    vars: getInitialVars(),
    rootDir,
  };
}

export function setArguments(ctx, args) {
  ctx.args = args;
  process.env.VERBOSE = !!args.verbose;
}

// Given a variable of the form $VARIABLE, resolve the
// actual value from the environment
export function resolveVariable(ctx, varName) {
  const foundVar = ctx.vars[(varName || '').slice(1)];

  if (foundVar) {
    return foundVar.value || '';
  } else if (foundVar === null) {
    return '';
  }

  return varName;
}

export function str(ctx, s) {
  // console.log('VAR', s);
  return resolveVariable(ctx, s);
}

function getInitialVars() {
  return {};
}
