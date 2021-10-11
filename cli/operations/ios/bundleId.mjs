import xml2js from 'xml2js';
import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

import { logger } from '../../util/log.mjs';

export default async function execute({ env, config }, op) {
  const filename = join(env.rootDir, 'ios', 'App', 'Info.plist');
}
