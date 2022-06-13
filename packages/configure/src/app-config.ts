import { pathExists, readJSON } from '@ionic/utils-fs';
import { resolve } from 'path';

import { resolveNode, requireTS } from './util/node';
import * as c from './colors';
import { fatal } from './util/log';
import { MobileProjectConfig } from '@trapezedev/project';

export const CONFIG_FILE_NAME_TS = 'trapeze.config.ts';
export const CONFIG_FILE_NAME_JS = 'trapeze.config.js';
export const CONFIG_FILE_NAME_JSON = 'trapeze.config.json';

async function loadExtConfigTS(
  rootDir: string,
  extConfigName: string,
  extConfigFilePath: string,
): Promise<MobileProjectConfig | null> {
  try {
    const extConfigObject = requireTS(extConfigFilePath) as any;
    return extConfigObject.default ?? extConfigObject;
  } catch (e) {
    console.warn('Unable to load Capacitor typescript config file', e);
    return null;
  }
}

async function loadExtConfigJS(
  rootDir: string,
  extConfigName: string,
  extConfigFilePath: string,
): Promise<MobileProjectConfig | null> {
  try {
    return require(extConfigFilePath);
  } catch (e) {
    console.warn('Unable to load Capacitor typescript config file', e);
    return null;
    // fatal(`Parsing ${c.strong(extConfigName)} failed.`, e as Error);
  }
}

export async function loadExtConfig(
  rootDir: string,
): Promise<MobileProjectConfig | null> {
  const extConfigFilePathTS = resolve(rootDir, CONFIG_FILE_NAME_TS);

  if (await pathExists(extConfigFilePathTS)) {
    const tsConfig = await loadExtConfigTS(
      rootDir,
      CONFIG_FILE_NAME_TS,
      extConfigFilePathTS,
    );
    return tsConfig;
  }

  const extConfigFilePathJS = resolve(rootDir, CONFIG_FILE_NAME_JS);

  if (await pathExists(extConfigFilePathJS)) {
    return loadExtConfigJS(rootDir, CONFIG_FILE_NAME_JS, extConfigFilePathJS);
  }

  const extConfigFilePath = resolve(rootDir, CONFIG_FILE_NAME_JSON);

  if (await pathExists(extConfigFilePath)) {
    let json: MobileProjectConfig | null = null;

    try {
      json = (await readJSON(extConfigFilePath, {
        encoding: 'utf-8',
      })) as MobileProjectConfig;
    } catch (e) {
      console.warn('Unable to parse Capacitor JSON config file', e as Error);
      return null;
    }

    return json;
  }

  console.warn(
    'Unable to find or parse the Capacitor project config file. Using defaults',
  );

  return null;
}
