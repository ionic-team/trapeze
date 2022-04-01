
import { dirname } from 'path';
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

export async function formatXml(doc: any) {
  var xml = new XMLSerializer().serializeToString(doc);

  const p = dirname(require.resolve('@prettier/plugin-xml'));

  const formatted = prettier.format(xml, {
    parser: 'xml',
    printWidth: 120,
    bracketSameLine: true,
    xmlWhitespaceSensitivity: 'ignore',
    tabWidth: 4,
    pluginSearchDirs: [p],
    plugins: [prettierXml]
  } as any);

  return formatted;
}

export async function writeXml(doc: any, filename: string) {
  const formatted = await formatXml(doc);
  return writeFile(filename, formatted);
}
