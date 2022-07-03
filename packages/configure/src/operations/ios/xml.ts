import { Context } from "../../ctx";
import { IosXmlOperation, Operation } from "../../definitions";

export default async function execute(ctx: Context, op: Operation) {
  const xmlOp = op as IosXmlOperation;
  const entries = xmlOp.value;

  for (const entry of entries) {
    const xmlFile = await ctx.project.ios?.getXmlFile(entry.file);

    if (!xmlFile) {
      throw new Error(`No such XML file for xml operation: ${entry.file}`);
    }

    await xmlFile.load();

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
