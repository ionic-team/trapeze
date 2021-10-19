import xcode from 'xcode';
import { pathExists } from '@ionic/utils-fs';

export async function parsePbxProject(filename): Promise<any> {
  if (!(await pathExists(filename))) {
    throw new Error(`pbxproj file does not exist at ${filename}`);
  }

  const proj = xcode.project(filename);
  return proj.parseSync();
  /*
  return new Promise((resolve, reject) => {
    proj.parse(err => {
      if (err) {
        return reject(err);
      }
      resolve(proj);
    });
  });
  */
}
