import { parseXml, parseXmlString } from "../util/xml";
import xpath, { SelectedValue } from 'xpath';
import { difference } from 'lodash';

const toArray = o => Array.prototype.slice.call(o || []);

export class AndroidManifest {
  private doc: Document;

  constructor(private path: string) {
  }

  async load() {
    this.doc = await parseXml(this.path);
  }

  getDocumentElement() {
    return this.doc?.documentElement;
  }

  find(target: string): any[] | null {
    return xpath.select(target, this.doc) as any;
  }

  /**
   * Injects a fragment of XML as a child of the given target.
   * Note: If the target resolves to a node list, each node will
   * have the fragment appended.
   */
  injectFragment(target: string, fragment: string) {
    const nodes = xpath.select(target, this.doc);
    const doc = parseXmlString(fragment).documentElement;

    nodes.forEach((n: any) => {
      if (!this.exists(n, doc)) {
        n.appendChild(doc);
      }
    });
  }

  /**
   * Set the key/value attributes on the target.
   * Note: if the target resolves to a node list, each node will
   * have its attributes modified
   */
  setAttrs(target: string, attrs: any) {
    const nodes = xpath.select(target, this.doc);
    nodes.forEach((n: any) => {
      Object.keys(attrs).forEach(attr => {
        n.setAttribute(attr, attrs[attr]);
      });
    });
  }

  /**
   * Check if a node already contains a given fragment. This is a
   * rather naive way to avoid duplicating fragments
   */
  private exists(node, fragment) {
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

}