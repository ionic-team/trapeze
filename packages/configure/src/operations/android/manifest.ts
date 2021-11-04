import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  for (const entry of op.value) {
    if (entry.attrs) {
      ctx.project.android?.getAndroidManifest().setAttrs(entry.target, entry.attrs)
    }
    if (entry.inject) {
      ctx.project.android?.getAndroidManifest().injectFragment(entry.target, entry.inject);
    }
  }
}