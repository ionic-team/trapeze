/// <reference lib="dom" />

import { dirname } from 'path';
import { readFile, writeFile } from '@ionic/utils-fs';
import xmldom, { XMLSerializer } from '@xmldom/xmldom';
import prettier from 'prettier';
import prettierXml from '@prettier/plugin-xml';

export async function parseXml(filename: string): Promise<Document> {
  let contents = await readFile(filename, { encoding: 'utf-8' });
  if (!contents) {
    contents = '<?xml version="1.0" encoding="utf-8" ?>\n<root />';
  }
  return new xmldom.DOMParser().parseFromString(contents, 'text/xml') as unknown as Document;
}

export function parseXmlString(contents: string): Document {
  return new xmldom.DOMParser().parseFromString(contents, 'text/xml') as unknown as Document;
}

/**
 * Parses an XML fragment that may contain multiple root elements
 * by wrapping it in a temporary root element.
 * Accepts optional namespace attributes to support prefixed elements.
 */
export function parseXmlFragment(contents: string, namespaceAttrs?: string): NodeList {
  const nsAttrs = namespaceAttrs ? ` ${namespaceAttrs}` : '';
  const wrapped = `<__fragment__${nsAttrs}>${contents}</__fragment__>`;
  const doc = new xmldom.DOMParser().parseFromString(wrapped, 'text/xml') as unknown as Document;
  return doc.documentElement.childNodes;
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
