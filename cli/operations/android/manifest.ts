import { join } from 'path';
import xpath from 'xpath';
import { difference } from 'lodash';

import { parseXml, parseXmlString, writeXml } from '../../util/xml';

export default async function execute(ctx, op) {
  const filename = join(
    ctx.rootDir,
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml',
  );

  for (let opData of op.value) {
    const doc = await parseXml(filename);

    applyOp(doc, opData);

    await writeXml(ctx, doc, filename);
  }
}

function applyOp(doc, opData) {
  const sel = opData.target;

  const nodes = xpath.select(sel, doc);

  if (opData.attrs) {
    setAttrs(nodes, opData.attrs);
  } else if (opData.append) {
    appendFragment(nodes, opData.append);
  }
}

function setAttrs(nodes, attrs) {
  nodes.forEach(n => {
    Object.keys(attrs).forEach(attr => {
      n.setAttribute(attr, attrs[attr]);
    });
  });
}

function appendFragment(nodes, contents) {
  const doc = parseXmlString(contents).documentElement;

  nodes.forEach(n => {
    if (!exists(n, doc)) {
      n.appendChild(doc);
    }
  });
}

// Check if the given node has a child matching this fragment by
// comparing its node name, and then checking if the fragment's
// attributes are contained in the superset of the existing
// node's attributes
function exists(node, fragment) {
  for (let child of toArray(node.childNodes)) {
    if (child.nodeName == fragment.nodeName) {
      if (
        difference(
          toArray(fragment.attributes).map(a => `${a.name}${a.value}`),
          toArray(child.attributes).map(a => `${a.name}${a.value}`),
        ).length == 0
      ) {
        return true;
      }
    }
  }

  return false;
}

const toArray = o => Array.prototype.slice.call(o || []);
