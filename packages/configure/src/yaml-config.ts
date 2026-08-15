import yaml from 'yaml';

import { clone, each, omit } from 'lodash';

import { readFile } from '@ionic/utils-fs';

import { logPrompt } from './util/cli';
import { Context, str, Variables } from './ctx';
import c from './colors';
import { initVarsFromEnv } from './ctx';
import { warn } from './util/log';

export type YamlFile = any;

export async function loadYamlConfig(
  ctx: Context,
  filename: string,
): Promise<YamlFile> {
  const contents = await readFile(filename, { encoding: 'utf-8' });
  const parsed = yaml.parse(contents, {
    prettyErrors: true,
    merge: true,
  });

  if (!parsed) {
    warn('Empty config file, exiting...');
    process.exit(0);
  }

  await initVarsFromEnv(ctx, parsed.vars as Variables);

  await ensureVars(ctx, parsed);

  const resolved = interpolateVars(ctx, parsed);

  return resolved;
}

async function ensureVars(ctx: Context, yaml: YamlFile) {
  const { vars } = yaml;

  for (const v in vars) {
    const vk = vars[v] || {};

    if (!vk || (typeof ctx.vars[v] === 'undefined' && typeof vk.default === 'undefined')) {
      const answers = await logPrompt(
        `Required variable: ${c.strong(v)}\n` +
          (vk.description
            ? `${c.strong('Description:')} ${vk.description}`
            : ''),
        {
          type: 'text',
          name: 'value',
          message: `${v} =`,
          validate: (input: any) => !!input,
        },
      );

      if (answers.value) {
        ctx.vars[v] = {
          value: answers.value,
        };
      }
    }
  }
}

function interpolateVars(ctx: Context, yaml: YamlFile) {
  const { vars } = yaml;

  for (let k in vars) {
    const v = vars[k];

    if (v && typeof v.default !== 'undefined') {
      v.value = v.default;
    }
  }

  ctx.vars = {
    ...vars,
    ...ctx.vars,
  };

  const config = interpolateVarsInTree(ctx, omit(yaml, 'vars'));

  // Variable declarations are left alone so their names aren't interpolated
  return vars ? { ...config, vars } : config;
}

function interpolateVarsInTree(ctx: Context, yaml: YamlFile) {
  const newObject = clone(yaml);

  each(yaml, (val, key) => {
    const newKey = interpolateKey(ctx, key);

    if (newKey !== key) {
      delete newObject[key];
    }

    newObject[newKey] = interpolateVarsInValue(ctx, val);
  });

  return newObject;
}

function interpolateVarsInValue(ctx: Context, val: any) {
  if (typeof val === 'string') {
    const interped = str(ctx, val);

    // Recur into the new object value to interp any sub-fields
    return typeof interped === 'object'
      ? interpolateVarsInTree(ctx, interped)
      : interped;
  }

  if (typeof val === 'object') {
    return interpolateVarsInTree(ctx, val);
  }

  return val;
}

// Array indices are passed through, and a key resolving to a JSON-valued
// variable is coerced back to a string since it has to stay usable as a key.
// Objects and arrays are serialized the same way `str` serializes them when
// they are embedded in a string
function interpolateKey(ctx: Context, key: string | number) {
  if (typeof key !== 'string') {
    return key;
  }

  const interped = str(ctx, key);

  if (typeof interped === 'string') {
    return interped;
  }

  return typeof interped === 'object'
    ? JSON.stringify(interped)
    : String(interped);
}
