import yaml from 'yaml';

import { clone, each } from 'lodash-es';

import ionicFs from '@ionic/utils-fs';

import { debug } from './util/log.mjs';
import { str } from './ctx.mjs';

export async function loadConfig(ctx, filename) {
  const contents = await ionicFs.readFile(filename, { encoding: 'utf-8' });
  const parsed = yaml.parse(contents, {
    prettyErrors: true,
  });

  await ensureVars(ctx, parsed);

  const resolved = interpolateVars(ctx, parsed);

  debug('Parsed YAML');
  debug(JSON.stringify(resolved, null, 2));

  return resolved;
}

async function ensureVars(ctx, yaml) {
  const { vars } = yaml;

  for (const v in vars) {
    const vk = vars[v];
    console.log(vk);

    if (!vk || (!ctx.vars[v] && !vk.default)) {
      console.error('Must provide value for var', v);
    }
  }
}

function interpolateVars(ctx, yaml) {
  const { vars } = yaml;

  for (let k in vars) {
    const v = vars[k];

    // TODO: Set any var values to the default
    if (v && v.default) {
      v.value = v.default;
    }
  }

  ctx.vars = {
    ...ctx.vars,
    ...vars,
  };

  return interpolateVarsInTree(ctx, yaml);
}

function interpolateVarsInTree(ctx, yaml) {
  const newObject = clone(yaml);

  each(yaml, (val, key) => {
    if (typeof val === 'string') {
      newObject[key] = str(ctx, val);
    } else if (typeof val === 'object' || typeof val === 'array') {
      newObject[key] = interpolateVarsInTree(ctx, val);
    }
  });

  return newObject;
}
