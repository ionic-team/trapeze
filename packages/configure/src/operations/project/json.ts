import { join } from 'path';

import { JsonFile, VFS } from '@trapezedev/project';
import { Context } from '../../ctx';
import { JsonOperation, Operation, OperationMeta } from '../../definitions';

function getJsonFile(path: string, vfs: VFS) {
  const existing = vfs.get(path);

  if (existing) {
    return existing.getData() as JsonFile;
  }
  return new JsonFile(path, vfs);
}

export default async function execute(ctx: Context, op: Operation) {
  const jsonOp = op as JsonOperation;
  const entries = jsonOp.value;

  for (const entry of entries) {
    let filename = entry.file;
    if (!filename) {
      continue;
    }

    let jsonFile: JsonFile = getJsonFile(join(ctx.project.projectRoot, filename), ctx.project.vfs);

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
  'project.json'
]