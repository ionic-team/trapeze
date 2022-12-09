import { join } from 'path';

import { Context } from '../../ctx';
import { AndroidPropertiesOperation, Operation, OperationMeta } from '../../definitions';
import { PropertiesFile } from '@trapezedev/project';

export default async function execute(ctx: Context, op: Operation) {
  const xmlOp = op as AndroidPropertiesOperation
  const entries = xmlOp.value;

  if (!ctx.project.android) {
    return;
  }

  for (const entry of entries) {
    let filename = entry.file;
    let file: PropertiesFile | null | undefined = null;

    file = ctx.project.android.getPropertiesFile(filename!);

    if (!file) {
      return;
    }

    await file.load();

    if (entry.entries) {
      file.updateProperties(entry.entries);
    }
  }
}

export const OPS: OperationMeta = [
  'android.properties'
]