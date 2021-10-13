import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

import { logger } from '../../util/log.mjs';
import { parseXml } from '../../util/xml.mjs';
import { writeXml } from '../../util/xml.mjs';

export default async function execute(ctx, op) {
  const filename = join(
    ctx.rootDir,
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml',
  );

  const doc = await parseXml(filename);

  doc.documentElement.setAttribute('package', op.value);

  await writeXml(ctx, doc, filename);
}
