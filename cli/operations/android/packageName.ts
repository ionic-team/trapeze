import { join } from 'path';

import { parseXml } from '../../util/xml';
import { writeXml } from '../../util/xml';

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
