import {
  LOGGER_LEVELS,
  StreamOutputStrategy,
  TTYOutputStrategy,
  createDefaultLogger,
} from '@ionic/cli-framework-output';
import CliFrameworkOutput from '@ionic/cli-framework-output';
const { LoggerLevelWeight } = CliFrameworkOutput;
import Prompts from 'prompts';
const { Answers, PromptObject } = Prompts;

import { logger } from './log.mjs';
import { isInteractive } from './term.mjs';
import c from '../colors.mjs';

export function wrapAction(action) {
  return async (...args) => {
    try {
      await action(...args);
    } catch (e) {
      logger.error(e.message);
      throw e;
    }
  };
}

export async function logPrompt(msg, promptObject) {
  const { wordWrap } = await import('@ionic/cli-framework-output');
  const prompt = await import('prompts');

  logger.log({
    msg: `${c.input(`[?]`)} ${wordWrap(msg, { indentation: 4 })}`,
    logger,
    format: false,
  });

  return prompt.default(promptObject, { onCancel: () => process.exit(1) });
}
