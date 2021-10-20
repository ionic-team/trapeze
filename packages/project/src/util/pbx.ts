import xcode from 'xcode';
import { pathExists } from '@ionic/utils-fs';

export async function parsePbxProject(filename: string): Promise<any> {
  if (!(await pathExists(filename))) {
    throw new Error(`pbxproj file does not exist at ${filename}`);
  }

  const proj = xcode.project(filename);
  return proj.parseSync();
}
