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
 * Inside a quoted value, a backslash and a double quote have to be escaped.
 */
export function pbxSerializeString(value: string) {
  if (!PBX_UNQUOTED_VALUE.test(value)) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

/**
 * The pbx parser hands quoted values back verbatim, quotes and escapes
 * included, so undo what `pbxSerializeString` wrote.
 */
export function pbxReadString(value: string) {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\([\\"])/g, '$1');
  }

  return value;
}