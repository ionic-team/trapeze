import { Context } from "../../ctx";
import { AndroidGradleOperation, Operation } from "../../definitions";
import { logger } from "../../util/log";

export default async function execute(ctx: Context, op: Operation) {
  const entries = (op as AndroidGradleOperation).value;

  for (let entry of entries) {
    const gradleFile = await ctx.project.android?.getGradleFile(entry.file);
    if (!gradleFile) {
      logger.warn(`Skipping ${op.id} - can't locate Gradle file ${entry.file}`);
      continue;
    }

    if (entry.replace) {
      await gradleFile.replaceProperties(entry.target, entry.replace);
    } else if (typeof entry.insert === 'string') {
      await gradleFile.insertFragment(entry.target, entry.insert);
    } else if (Array.isArray(entry.insert)) {
      await gradleFile.insertProperties(entry.target, entry.insert);
    } else {
      throw new Error(`Invalid \'insert\' type for gradle operation. Must be a string or array of objects: ${JSON.stringify(entry.insert, null, 2)}`);
    }
  }
}