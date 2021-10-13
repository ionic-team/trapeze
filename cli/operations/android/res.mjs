import { join } from 'path';
import ionicFs from '@ionic/utils-fs';

export default async function execute(ctx, op) {
  const resRoot = join(ctx.rootDir, 'android', 'app', 'src', 'main', 'res');

  const resOps = op.value;

  for (let resOp of resOps) {
    const resDir = join(resRoot, resOp.path);
    if (!(await ionicFs.pathExists(resDir))) {
      await ionicFs.mkdir(resDir);
    }

    // Raw text supplied, write it
    if (resOp.text) {
      await ionicFs.writeFile(join(resDir, resOp.file), resOp.text);
    } else if (resOp.source) {
      const sourceData = await ionicFs.readFile(resOp.source);
      await ionicFs.writeFile(join(resDir, resOp.file), sourceData);
    }
  }
}
