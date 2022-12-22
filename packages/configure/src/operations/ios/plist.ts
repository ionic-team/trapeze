import { parsePlistString } from '@trapezedev/project';
import { Context } from '../../ctx';
import { IosPlistOperationValue, Operation, OperationMeta } from '../../definitions';
import { logger } from '../../util/log';

// I hate this, refactor
export default async function execute(ctx: Context, op: Operation) {
  if (Array.isArray(op.value)) {
    const plistOp = op.value as IosPlistOperationValue[];
    for (const pop of plistOp) {
      if (pop.file) {
        const file = await ctx.project.ios?.getPlistFile(pop.file);
        if (!file) {
          throw new Error(`No such plist file for plist operation: ${pop.file}`);
        }

        await file.load();

        if (pop.entries) {
          for (const entries of pop.entries) {
            if (pop.replace) {
              file.set(entries);
            } else {
              file.merge(entries);
            }
          }
        } else if (pop.xml) {
          file.setFromXml(pop.xml);
        }
      } else {
        if (pop.xml) {
          const entries = parsePlistString(pop.xml);
          await ctx.project.ios?.updateInfoPlist(pop.iosTarget ?? null, pop.iosBuild ?? null, entries, {
            replace: pop.replace ?? false
          });
        } else {
          for (const entries of (pop.entries ?? [])) {
            try {
              await ctx.project.ios?.updateInfoPlist(pop.iosTarget ?? null, pop.iosBuild ?? null, entries, {
                replace: pop.replace ?? false
              });
            } catch (e) {
              logger.warn(`Skipping ${op.id} (${(e as any).message})`);
            }
          }
        }
      }
    }
  } else {
    // Old format
    const plistOp = op.value as IosPlistOperationValue;
    for (const entries of (plistOp.entries ?? [])) {
      try {
        await ctx.project.ios?.updateInfoPlist(op.iosTarget ?? null, op.iosBuild ?? null, entries, {
          replace: plistOp.replace ?? false
        });
      } catch (e) {
        logger.warn(`Skipping ${op.id} (${(e as any).message})`);
      }
    }
  }
}

export const OPS: OperationMeta = [
  'ios.plist'
]