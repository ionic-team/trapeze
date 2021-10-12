import gradleToJs from 'gradle-to-js/lib/parser.js';

import { join } from 'path';

import { logger } from '../../util/log.mjs';

export default async function execute(ctx, op) {
  const filename =
    op.name == 'build.gradle'
      ? join(ctx.rootDir, 'android', 'build.gradle')
      : join(ctx.rootDir, 'android', 'app', 'build.gradle');

  const parsed = await gradleToJs.parseFile(filename);
  logger.debug(`----${op.name}-----`);
  logger.debug(JSON.stringify(parsed, null, 2));
  logger.debug(`----------------------`);

  const modifications = [];
  updateTree(parsed, op.value, modifications);

  outputGradle(ctx, config, parsed);
}

function updateTree(parsedNode, node, modifications) {
  logger.debug('Modifying gradle', parsedNode, node);

  // Once we get to an array, assume we're modifying lines
  if (Array.isArray(node)) {
    modifyNode(parsedNode, node, modifications);
  } else {
    Object.keys(node).forEach(n => {
      console.log(n);
      updateTree(parsedNode[n], node[n], modifications);
    });
  }
}

function modifyNode(parsedNode, node, modifications) {
  logger.debug('Modify the node', parsedNode, node);
}

async function outputGradle(ctx, config, parsed) {}
