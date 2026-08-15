import { Context } from "../../ctx";
import { AndroidGradleOperation, Operation, OperationMeta } from "../../definitions";
import { logger } from "../../util/log";

export default async function execute(ctx: Context, op: Operation) {
  const entries = (op as AndroidGradleOperation).value;
  const gradleFiles = new Map()
  for (let entry of entries) {
    if(!gradleFiles.has(entry.file)) {
      const file = await ctx.project.android?.getGradleFile(entry.file);
      gradleFiles.set(entry.file, file)
    }
    const gradleFile = gradleFiles.get(entry.file)
    if (!gradleFile) {
      logger.warn(`Skipping ${op.id} - can't locate Gradle file ${entry.file}`);
      continue;
    }

    if (entry.replace) {
      await gradleFile.replaceProperties(entry.target, toReplaceObject(entry.replace), entry.exact, entry.insertType);
    } else if (typeof entry.insert === 'string') {
      await gradleFile.insertFragment(entry.target, entry.insert, entry.exact);
    } else if (Array.isArray(entry.insert)) {
      await gradleFile.insertProperties(entry.target, entry.insert, entry.insertType, entry.exact);
    } else {
      throw new Error(`Invalid \'insert\' type for gradle operation. Must be a string or array of objects: ${JSON.stringify(entry.insert, null, 2)}`);
    }
  }
}

// `replace` takes an object of properties, but the neighboring `insert` takes a list, so a
// list is accepted here as well and merged into a single object instead of generating
// method-style code for it
function toReplaceObject(replace: any) {
  if (!Array.isArray(replace)) {
    return replace;
  }

  return replace.reduce((merged, entry) => {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      throw new Error(`Invalid 'replace' entry for gradle operation. Must be an object of properties: ${JSON.stringify(entry, null, 2)}`);
    }
    return { ...merged, ...entry };
  }, {});
}

export const OPS: OperationMeta = [
  'android.gradle'
]
