import yargs from 'yargs';
import { join } from 'path';
import { hideBin } from 'yargs/helpers';

import { loadProject } from './project';
import { MobileProject } from '@trapezedev/project';
import { log, warn } from './util/log';

export interface Context {
  project: MobileProject;
  // Path the to the root of the capacitor project, if needed
  projectRootPath?: string;
  args: any;
  vars: Variables;
  nodePackageRoot: string;
  rootDir: string;
}

export interface Variable {
  value: string;
}

export interface Variables {
  [variable: string]: Variable;
}

export async function loadContext(projectRootPath?: string, androidProject?: string, iosProject?: string): Promise<Context> {
  const rootDir = process.cwd();

  const args = yargs(hideBin(process.argv));

  const argv = args.argv;

  let project: MobileProject;

  try {
    project = await loadProject(
      projectRootPath ?? (argv.projectRoot as string | undefined),
      androidProject ?? argv.androidProject as string | undefined,
      iosProject ?? argv.iosProject as string | undefined
    );
  } catch (e) {
    throw new Error(
      `Unable to load Capacitor project: ${(e as Error).message}: ${
        (e as Error).stack
      }`,
    );
  }

  return {
    project,
    args: argv,
    vars: {},
    projectRootPath,
    // Important for resolving custom prettier plugin
    nodePackageRoot: join(__dirname, '../../'),
    rootDir,
  };
}

export function initLogging(args: string[]) {
  process.env.VERBOSE = process.env.VERBOSE || '' + !!args.find(a => a === '--verbose');
}

export function setArguments(ctx: Context, args: any) {
  ctx.args = args;
}

// Given a variable of the form $VARIABLE, resolve the
// actual value from the environment
export function str(ctx: Context, s: string): string | any {
  // Check for situations where our string exactly matches a var and
  // then use that as a special case to either interpolate the string
  // or return the variables value (to support JSON-values);
  const foundVar = ctx.vars[s.slice(1)];
  if (foundVar) {
    if (typeof foundVar.value === 'string') {
      return s.replace(/\$[^\(][\w.]+/g, foundVar.value);
    }
    return foundVar.value;
  }

  // Otherwise do a string interpolation of each value
  // Replace any variables in the string, ignoring
  // ones of the type $(blah) which are handled by the platform (i.e. iOS)
  s = s.replace(/\$[^\(][\w]+/g, (m: string) => {
    const foundVar = ctx.vars[m.slice(1)];

    if (foundVar && typeof foundVar.value === 'string') {
      return foundVar.value || '';
    } else {
      // We're in a string so the only thing to do at this point is
      // serialize any JSON values
      return foundVar ? JSON.stringify(foundVar.value) : '';
    }
  });

  return s;
}

// Given a list of vars from our configuration, initialize
// any that are already found in the process env
export function initVarsFromEnv(ctx: Context, vars: Variables) {
  if (!vars) {
    return;
  }

  for (const v in vars) {
    let existing = process.env[v];
    try {
      existing = existing && JSON.parse(existing!);
    } catch (e) {
      warn(`Unable to parse environment variable ${v} as JSON, processing as string instead`);
    } finally {
      if (existing) {
        ctx.vars[v] = {
          value: existing,
        };
      }
    }
  }
}
