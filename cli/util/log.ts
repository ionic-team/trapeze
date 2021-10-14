import {
  LOGGER_LEVELS,
  StreamOutputStrategy,
  TTYOutputStrategy,
  createDefaultLogger,
} from '@ionic/cli-framework-output';
import { LoggerLevelWeight } from '@ionic/cli-framework-output';
import Prompts from 'prompts';
const { Answers, PromptObject } = Prompts;

import { isInteractive } from './term';
import c from '../colors';

const options = {
  colors: c,
  stream: process.argv.includes('--json') ? process.stderr : process.stdout,
};

export const output = isInteractive()
  ? new TTYOutputStrategy(options)
  : new StreamOutputStrategy(options);

export const logger = createDefaultLogger({
  output,
  formatterOptions: {
    titleize: false,
    tags: new Map([
      [LOGGER_LEVELS.DEBUG, c.log.DEBUG('[debug]')],
      [LOGGER_LEVELS.INFO, c.log.INFO('[info]')],
      [LOGGER_LEVELS.WARN, c.log.WARN('[warn]')],
      [LOGGER_LEVELS.ERROR, c.log.ERROR('[error]')],
    ]),
  },
});

export function debug(...args) {
  if (process.env.VERBOSE !== 'false') {
    console.log(...args);
  }
}
export function log(...args) {
  console.log(...args);
}

export function warn(...args) {
  console.warn(...args);
}

export function error(...args) {
  console.warn(...args);
}

export function fatal(msg, exc) {
  console.error(c.failure(`Fatal error: ${msg}`));
  if (exc) {
    console.error(exc);
  }
  process.exit(1);
}
