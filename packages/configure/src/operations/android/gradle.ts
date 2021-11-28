import { Context } from "../../ctx";
import { AndroidGradleOperation, Operation } from "../../definitions";

export default async function execute(ctx: Context, op: Operation) {
  const entries = (op as AndroidGradleOperation).value;

  for (let entry of entries) {
    const gradleFile = ctx.project.android?.getGradleFile(entry.file);
    if (!gradleFile) {
      throw new Error(`Unable to modify gradle file ${entry.file}. Options are build.gradle or app/build.gradle`);
    }
    if (typeof entry.insert === 'string') {
      await gradleFile.insertFragment(entry.target, entry.insert);
    } else if (Array.isArray(entry.insert)) {
      await gradleFile.insertProperties(entry.target, entry.insert);
    } else {
      throw new Error(`Invalid \'insert\' type for gradle operation. Must be a string or array of objects: ${JSON.stringify(entry.insert, null, 2)}`);
    }
  }
}