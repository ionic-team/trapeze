import { Context } from "../../ctx";
import { Operation } from "../../definitions";

export default async function execute(ctx: Context, op: Operation) {
  if (op.id === 'android.versionCode') {
    return ctx.project.android?.setVersionCode(op.value);
  } else if (op.id === 'android.versionName') {
    return ctx.project.android?.setVersionName(op.value);
  } else if (op.id === 'android.incrementVersionCode') {
    return ctx.project.android?.incrementVersionCode();
  }
}
