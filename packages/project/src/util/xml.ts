import { readFile, writeFile } from '@ionic/utils-fs';
import xmldom, { XMLSerializer } from '@xmldom/xmldom';
import prettier from 'prettier/standalone';
import prettierXml from '@prettier/plugin-xml';

export async function parseXml(filename: string) {
  const contents = await readFile(filename, { encoding: 'utf-8' });
  return new xmldom.DOMParser().parseFromString(contents);
}

export function parseXmlString(contents: string) {
  return new xmldom.DOMParser().parseFromString(contents);
}

export function serializeXml(doc: any) {
  return new XMLSerializer().serializeToString(doc);
}

export async function writeXml(doc: any, filename: string, nodePackageRoot: string) {
  var xml = new XMLSerializer().serializeToString(doc);

  const formatted = prettier.format(xml, {
    parser: 'xml',
    printWidth: 120,
    bracketSameLine: true,
    xmlWhitespaceSensitivity: 'ignore',
    tabWidth: 4,
    pluginSearchDirs: [nodePackageRoot],
    plugins: [prettierXml]
  } as any);

  return writeFile(filename, formatted);
}
