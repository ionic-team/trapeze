import { lstat, readdirp } from '@ionic/utils-fs';
import { Context } from '../ctx';
import { Operation } from '../definitions';
import { basename, extname } from 'path';
import { error } from '../util/log';

type OperationHandler = (ctx: Context, op: Operation) => Promise<any>;

export interface OperationHandlers {
  [id: string]: OperationHandler;
}


export async function loadHandlers() {
  const operations: OperationHandlers = {};

  const files = await readdirp(__dirname);

  for (const file of files) {
    const ext = extname(file);

    // Only load .js, .ts, or .mjs (no .d.ts) files
    if (basename(file).indexOf('.d.ts') >= 0 ||
       (ext !== '.js' && ext !== '.ts' && ext !== '.mjs')) {
      continue;
    }

    const stat = await lstat(file);
    if (stat.isDirectory()) {
      continue;
    }

    try {
      const f = await import(file);

      const meta = f.OPS;

      if (meta) {
        for (const id of meta) {
          operations[id] = f.default;
        }
      }
    } catch (e) {
      error('Unable to import operation JS file', e);
    }
  }

  return operations;
}


export function isOpRegistered(operations: OperationHandlers, opName: string) {
  return opName in operations;
}

const enabled: string[] | null = null; //['ios.plist'];

export function runOperation(ctx: Context, operations: OperationHandlers, op: Operation) {
  const handler = operations[op.id];

  if (enabled !== null && !enabled.find((e: string) => e === op.id)) {
    return Promise.resolve();
  }

  if (handler) {
    return handler(ctx, op);
  } else {
    return Promise.reject(`No handler for operation ${op.id}`);
  }
}