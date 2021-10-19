import yargs from 'yargs';
import { join } from 'path';
import { hideBin } from 'yargs/helpers';

import { loadProject } from './project';

import { CapacitorProject } from '../lib';

export interface Context {
  project: CapacitorProject;
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

export async function loadContext(projectRootPath?: string): Promise<Context> {
  const rootDir = process.cwd();

  const argv = yargs(hideBin(process.argv)).argv;

  let project: CapacitorProject | null;

  try {
    project = await loadProject(projectRootPath);
  } catch (e) {
    throw new Error('Unable to load Capacitor project');
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

export function setArguments(ctx: Context, args: any) {
  ctx.args = args;
  process.env.VERBOSE = '' + !!args.verbose;
}

// Given a variable of the form $VARIABLE, resolve the
// actual value from the environment
export function str(ctx: Context, s: string) {
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
export function initVarsFromEnv(ctx: Context, vars: Variables) {
  for (const v in vars) {
    const existing = process.env[v];
    if (existing) {
      ctx.vars[v] = {
        value: existing,
      };
    }
  }
}
