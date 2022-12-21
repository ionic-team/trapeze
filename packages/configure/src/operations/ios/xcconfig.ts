import { Context } from '../../ctx';
import { IosXCConfigOperation, Operation, OperationMeta } from '../../definitions';
import { XCConfigFile } from '@trapezedev/project';

export default async function execute(ctx: Context, op: Operation) {
  const stringsOp = op as IosXCConfigOperation;
  const entries = stringsOp.value;

  if (!ctx.project.ios) {
    return;
  }

  for (const entry of entries) {
    let filename = entry.file;
    let file: XCConfigFile | null | undefined = null;

    file = ctx.project.ios?.getProjectFile<XCConfigFile>(
      filename!,
      (filename: string) => new XCConfigFile(filename, ctx.project.vfs, ctx.project)
    );

    if (!file) {
      return;
    }

    await file.load();

    if (entry.set) {
      file.set(entry.set);
    }
  }
}

export const OPS: OperationMeta = [
  'ios.xcconfig'
]