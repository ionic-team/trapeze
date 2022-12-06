
import { VFS, XmlFile } from '@trapezedev/project';
import { join } from 'path';

import { Context } from "../../ctx";
import { XmlOperation, Operation } from "../../definitions";
import { error } from '../../util/log';

function getXmlFile(path: string, vfs: VFS) {
  const existing = vfs.get(path);

  if (existing) {
    return existing.getData() as XmlFile;
  }
  return new XmlFile(path, vfs);
}

export default async function execute(ctx: Context, op: Operation) {
  const xmlOp = op as XmlOperation;
  const entries = xmlOp.value;

  for (const entry of entries) {
    let filename = entry.file;
    if (!filename) {
      continue;
    }
    let xmlFile: XmlFile = getXmlFile(join(ctx.project.projectRoot, filename), ctx.project.vfs);

    try {
      await xmlFile.load();
    } catch (e) {
      error('Unable to load the XML file here', e);
      return;
    }

    if (entry.attrs) {
      await xmlFile.setAttrs(entry.target, entry.merge);
    } else if (entry.inject) {
      await xmlFile.injectFragment(entry.target, entry.inject);
    } else if (entry.merge) {
      await xmlFile.mergeFragment(entry.target, entry.merge);
    } else if (entry.replace) {
      await xmlFile.replaceFragment(entry.target, entry.replace);
    } else if (entry.delete) {
      await xmlFile.deleteNodes(entry.delete);
    } else if (entry.deleteAttributes) {
      await xmlFile.deleteAttributes(entry.target, entry.deleteAttributes);
    }
  }
}
