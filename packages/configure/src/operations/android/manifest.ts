import { Context } from '../../ctx';
import { AndroidManifestOperation, Operation, OperationMeta } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  const manifestOp = op as AndroidManifestOperation;

  for (const entry of manifestOp.value) {
    if (entry.attrs) {
      ctx.project.android?.getAndroidManifest().setAttrs(entry.target, entry.attrs)
    }
    if (entry.inject) {
      ctx.project.android?.getAndroidManifest().injectFragment(entry.target, entry.inject);
    }
    if (entry.merge) {
      ctx.project.android?.getAndroidManifest().mergeFragment(entry.target, entry.merge);
    }
    if (entry.delete) {
      ctx.project.android?.getAndroidManifest().deleteNodes(entry.delete);
    }
    if (entry.deleteAttributes) {
      ctx.project.android?.getAndroidManifest().deleteAttributes(entry.target, entry.deleteAttributes);
    }
  }
}

export const OPS: OperationMeta = [
  'android.manifest'
]