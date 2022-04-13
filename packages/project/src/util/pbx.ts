import xcode from 'xcode';
import { pathExists } from '@ionic/utils-fs';

export async function parsePbxProject(filename: string): Promise<any> {
  if (!(await pathExists(filename))) {
    throw new Error(`pbxproj file does not exist at ${filename}`);
  }

  const proj = xcode.project(filename);
  return proj.parseSync();
}

/**
 * PBX files are esoteric. Based on http://danwright.info/blog/2010/10/xcode-pbxproject-files/
 * we try to quote strings that need to be quoted. Right now
 * that test is just for a few characters but there may be
 * more that we need here
 */
export function pbxSerializeString(value: string) {
  if (/[\s;]/.test(value)) {
    return `"${value}"`;
  }
  return value;
}

// Remove any quotes at the beginning and end of the string value
export function pbxReadString(value: string) {
  return value?.replace(/(^")+|("$)+/g, '');
}