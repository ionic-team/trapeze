import { Context } from "../../ctx";
import { XmlFile } from '@trapezedev/project';
import { AndroidXmlOperation, Operation } from "../../definitions";

export default async function execute(ctx: Context, op: Operation) {
  const xmlOp = op as AndroidXmlOperation;
  const entries = xmlOp.value;

  for (const entry of entries) {
    let filename = entry.file;
    let xmlFile: XmlFile | null | undefined = null;

    if (entry.resFile) {
      filename = entry.resFile;
      xmlFile = ctx.project.android?.getResourceXmlFile(filename!);
    } else {
      xmlFile = ctx.project.android?.getXmlFile(filename!);
    }

    if (!xmlFile) {
      throw new Error(`No such XML file for xml operation: ${filename!}`);
    }

    try {
      await xmlFile.load();
    } catch (e) {
      console.log('Unable to load the XML file here', e);
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
