import envPaths from 'env-paths';

import { error } from '../log.mjs';

export function wrapAction(action) {
  return async (...args) => {
    try {
      await action(...args);
    } catch (e) {
      error(e.message);
      throw e;
    }
  };
}
