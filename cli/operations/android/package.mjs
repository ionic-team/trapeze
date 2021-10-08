import xml2js from 'xml2js';
import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

import { logger } from '../../util/log.mjs';

export default async function execute({ env, config }, op) {
  const filename = join(
    env.rootDir,
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml',
  );

  const parsed = await parseAndroidManifest(env, config, op, filename);

  logger.debug(op.value);
  parsed.manifest['$'].package = op.value;

  await writeAndroidManifest(env, config, op, parsed, filename);
}

function parseAndroidManifest(env, config, op, filename) {
  return new Promise(async (resolve, reject) => {
    const contents = await ionicFs.readFile(filename, { encoding: 'utf-8' });
    logger.debug(contents);

    const parsed = xml2js.parseString(contents, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      logger.debug(result);

      resolve(result);
    });
  });
}

async function writeAndroidManifest(env, config, op, parsed, filename) {
  logger.debug('Writing', parsed);

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(parsed);

  logger.debug(xml);
  return ionicFs.writeFile(filename, xml);
}
