import { join } from 'path';
import { readFile, writeFile } from '@ionic/utils-fs';

export default async function execute(ctx, op) {
  const filename = join(ctx.rootDir, 'android', 'app', 'build.gradle');

  let contents = await readFile(filename, { encoding: 'utf-8' });

  if (op.id === 'android.versionCode') {
    // Match entries of the form
    // versionCode 12
    contents = contents.replace(/(versionCode\s+)\w+/, `$1${op.value}`);
    return [
      new Change({
        file: filename,
        data: contents
      }, Change.WriteFileChangeCommitStrategy)
    ];
  } else if (op.id === 'android.versionName') {
    // Match entries of the form
    // versionName "1.0.1"
    // with double or single quotes
    contents = contents.replace(
      /(versionName\s+)["'][^"']+["']/,
      `$1"${op.value}"`,
    );

    return [
      new Change({
        file: filename,
        data: contents
      }, Change.WriteFileChangeCommitStrategy)
    ];
  } else if (op.id === 'android.incrementVersionCode') {
    const versionCode = contents.match(/versionCode\s+(\w+)/);
    const num = parseInt(versionCode[1]);

    if (!isNaN(num)) {
      contents = contents.replace(/(versionCode\s+)\w+/, `$1${num + 1}`);
      return [
        new Change({
          file: filename,
          data: contents
        }, Change.WriteFileChangeCommitStrategy)
      ];
    }
  }
}
