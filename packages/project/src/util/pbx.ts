import xcode from 'xcode';
import { pathExists } from '@ionic/utils-fs';

export async function parsePbxProject(filename: string): Promise<any> {
  if (!(await pathExists(filename))) {
    throw new Error(`pbxproj file does not exist at ${filename}`);
  }

  const proj = xcode.project(filename);
  return proj.parseSync();
}

// Xcode leaves a value unquoted only when it consists solely of these characters,
// see http://danwright.info/blog/2010/10/xcode-pbxproject-files/
const PBX_UNQUOTED_VALUE = /^[A-Za-z0-9_$./]+$/;

/**
 * PBX files are esoteric. Quote every value that Xcode itself would quote,
 * otherwise the pbxproj we write can no longer be parsed (a `,` terminates a
 * value, and non-ASCII characters are not valid in an unquoted value).
 */
export function pbxSerializeString(value: string) {
  if (!PBX_UNQUOTED_VALUE.test(value)) {
    return `"${value}"`;
  }
  return value;
}

// Remove any quotes at the beginning and end of the string value
export function pbxReadString(value: string) {
  if (typeof value === 'string') {
    return value?.replace(/(^")+|("$)+/g, '');
  } else {
    return value;
  }
}