import { join } from 'path';

import { JsonFile } from '@capacitor/project';
import { Context } from '../../ctx';
import { IosJsonOperation, Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const xmlOp = op as IosJsonOperation;
  const entries = xmlOp.value;

  if (!ctx.project.ios) {
    return;
  }

  for (const entry of entries) {
    let filename = entry.file;
    let jsonFile: JsonFile | null | undefined = null;

    jsonFile = ctx.project.ios?.getProjectFile<JsonFile>(
      filename!,
      (filename: string) => new JsonFile(filename, ctx.project.vfs),
    );

    if (!jsonFile) {
      return;
    }

    try {
      await jsonFile.load();
    } catch (e) {
      console.log('Unable to load the JSON file here', e);
    }

    if (entry.set) {
      jsonFile.set(entry.set);
    }
    if (entry.merge) {
      jsonFile.merge(entry.merge);
    }
  }
}
