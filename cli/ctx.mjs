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

function getInitialVars() {
  return {};
}
