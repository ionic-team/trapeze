export default async function execute(ctx, op) {
  if (op.id === 'android.versionCode') {
    ctx.project.android.setVersionCode(op.value);
  } else if (op.id === 'android.versionName') {
    ctx.project.android.setVersionName(op.value);
  } else if (op.id === 'android.incrementVersionCode') {
    ctx.project.android.incrementVersionCode();
  }
}
