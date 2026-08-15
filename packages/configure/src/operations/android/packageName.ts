import { Context, isDryRun } from '../../ctx';
import { Operation, OperationMeta } from '../../definitions';
import { logger } from '../../util/log';

export default async function execute(ctx: Context, op: Operation) {
  // setPackageName moves source files on disk, which the VFS cannot preview or roll back
  if (isDryRun(ctx)) {
    logger.info(`Would set package name to ${op.value}`);
    return;
  }

  return ctx.project.android?.setPackageName(op.value);
}

export const OPS: OperationMeta = [
  'android.packageName'
]
