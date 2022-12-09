import { join } from 'path';

import { JsonFile } from '@trapezedev/project';
import { Context } from '../../ctx';
import { AndroidJsonOperation, Operation, OperationMeta } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const xmlOp = op as AndroidJsonOperation;
  const entries = xmlOp.value;

  if (!ctx.project.android) {
    return;
  }

  for (const entry of entries) {
    let filename = entry.file;
    let jsonFile: JsonFile | null | undefined = null;

    if (entry.resFile) {
      filename = join(ctx.project.android.getResourcesPath(), entry.resFile);
    }

    jsonFile = ctx.project.android.getProjectFile<JsonFile>(
      filename!,
      (filename: string) => new JsonFile(filename, ctx.project.vfs),
    );

    if (!jsonFile) {
      return;
    }

    await jsonFile.load();

    if (entry.set) {
      jsonFile.set(entry.set);
    }
    if (entry.merge) {
      jsonFile.merge(entry.merge);
    }
  }
}

export const OPS: OperationMeta = [
  'android.json'
]