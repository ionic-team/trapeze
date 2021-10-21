import { Context } from '../../ctx';
import { Operation } from '../../definitions';

export default async function execute(ctx: Context, op: Operation) {
  // const android = ctx.project.android;

  if (op.value.attrs) {
    ctx.project.android.getAndroidManifest().setAttrs(op.value.target, op.value.attrs)
  }
  if (op.value.inject) {
    ctx.project.android.getAndroidManifest().injectFragment(op.value.target, op.value.inject);
  }
}