import ionicFs from '@ionic/utils-fs';
import xmldom, { XMLSerializer } from '@xmldom/xmldom';
import prettier from 'prettier';

export async function parseXml(filename) {
  const contents = await ionicFs.readFile(filename, { encoding: 'utf-8' });
  return new xmldom.DOMParser().parseFromString(contents);
}

export function parseXmlString(contents) {
  return new xmldom.DOMParser().parseFromString(contents);
}

export async function writeXml(ctx, doc, filename) {
  var xml = new XMLSerializer().serializeToString(doc);

  const formatted = prettier.format(xml, {
    parser: 'xml',
    printWidth: 120,
    bracketSameLine: true,
    xmlWhitespaceSensitivity: 'ignore',
    tabWidth: 4,
    pluginSearchDirs: [ctx.nodePackageRoot],
  });

  return ionicFs.writeFile(filename, formatted);
}
