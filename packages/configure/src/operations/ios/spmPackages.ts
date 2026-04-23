import { Context } from '../../ctx';
import { Operation, OperationMeta } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  for (let spmPackage of op.value) {
    ctx.project.ios?.addSPMPackage(op.iosTarget, spmPackage);
  }
}

export const OPS: OperationMeta = [
  'ios.spmPackages'
]