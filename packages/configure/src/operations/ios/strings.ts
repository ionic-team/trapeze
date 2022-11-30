import { join } from 'path';

import { JsonFile, StringsFile } from '@trapezedev/project';
import { Context } from '../../ctx';
import { IosStringsOperation, Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const stringsOp = op as IosStringsOperation;
  const entries = stringsOp.value;

  if (!ctx.project.ios) {
    return;
  }

  for (const entry of entries) {
    let filename = entry.file;
    let stringsFile: StringsFile | null | undefined = null;

    stringsFile = ctx.project.ios?.getProjectFile<StringsFile>(
      filename!,
      (filename: string) => new StringsFile(filename, ctx.project.vfs)
    );

    if (!stringsFile) {
      return;
    }

    await stringsFile.load();

    if (entry.set) {
      stringsFile.set(entry.set);
    }

    if (entry.setFromJson) {
      await stringsFile.setFromJson(entry.setFromJson);
    }
  }
}
