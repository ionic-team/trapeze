import gradleToJs from 'gradle-to-js/lib/parser.js';

import { join } from 'path';

import { debug } from '../../log.mjs';

export default async function execute(env, config, op) {
  const filename =
    op.name == 'build.gradle'
      ? join(env.rootDir, 'android', 'build.gradle')
      : join(env.rootDir, 'android', 'app', 'build.gradle');

  const parsed = await gradleToJs.parseFile(filename);
  debug(`----${op.name}-----`);
  debug(JSON.stringify(parsed, null, 2));
  debug(`----------------------`);

  const modifications = [];
  updateTree(parsed, op.value, modifications);

  outputGradle(env, config, parsed);
}

function updateTree(parsedNode, node, modifications) {
  debug('Modifying gradle', parsedNode, node);

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
  console.log('Modify the node', parsedNode, node);
}

async function outputGradle(env, config, parsed) {}
