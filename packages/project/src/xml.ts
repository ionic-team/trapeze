import { parseXml, parseXmlString, writeXml } from "./util/xml";
import xpath from 'xpath';
import { difference, isEqual, isObject, transform } from 'lodash';
import { VFS, VFSRef } from "./vfs";

const toArray = (o: any[]) => Array.prototype.slice.call(o || []);

export class XmlFile {
  private doc: Document | null = null;

  constructor(private path: string, private vfs: VFS) {
  }

  async load() {
    this.doc = await parseXml(this.path);
    this.vfs.open(this.path, this, this.xmlCommitFn);
  }

  getDocumentElement() {
    return this.doc?.documentElement;
  }

  find(target: string): any[] | null {
    if (!this.doc) {
      return null;
    }

    return xpath.select(target, this.doc) as any;
  }

  deleteNodes(target: string) {
    if (!this.doc) {
      return;
    }

    const nodes = xpath.select(target, this.doc) as Element[];
    nodes.forEach(n => n.parentNode?.removeChild(n));

    this.vfs.set(this.path, this);
  }

  deleteAttributes(target: string, attributes: string[]) {
    if (!this.doc) {
      return;
    }

    const nodes = xpath.select(target, this.doc) as Element[];
    nodes.forEach(n => attributes.forEach(a => n.removeAttribute(a)));

    this.vfs.set(this.path, this);
  }

  /**
   * Injects a fragment of XML as a child of the given target.
   * Note: If the target resolves to a node list, each node will
   * have the fragment appended.
   */
  injectFragment(target: string, fragment: string) {
    if (!this.doc) {
      return;
    }

    const nodes = xpath.select(target, this.doc) as Element[];
    const parsed = parseXmlString(fragment);
    const docNodes = parsed.childNodes ?? [];

    nodes.forEach(n => Array.prototype.forEach.call(docNodes, d => n.appendChild(d)))

    this.vfs.set(this.path, this);
  }

  /**
   * Merges a fragment of XML into the given target.
   */
  mergeFragment(target: string, fragment: string) {
    if (!this.doc) {
      return;
    }

    const nodes = xpath.select(target, this.doc) as Element[];
    const parsed = parseXmlString(fragment);
    const docNodes = parsed.childNodes ?? [];

    nodes.forEach(n => {
      Array.prototype.forEach.call(docNodes, doc => {
        const existingChild = Array.prototype.find.call(n.childNodes, (en) => en.nodeName === doc.nodeName);

        // If the child doesn't exist, append it and finish
        if (!existingChild || !this.exists(n, doc)) {
          n.appendChild(doc);
        } else {
          // Child exists, so merge the two nodes
          this._mergeNodes(existingChild, doc);
        }
      });
    });

    this.vfs.set(this.path, this);
  }

  _mergeNodes(oldEl: Element, newEl: Element) {
    Array.prototype.forEach.call(newEl.childNodes ?? [], (n) => {
      const exists = this.exists(oldEl, n);
      if (!exists) {
        oldEl.appendChild(n);
      }
      // TODO: make this recursive?
    });
  }

  /**
   * Replaces a given target with the given fragment
   */
  replaceFragment(target: string, fragment: string) {
    if (!this.doc) {
      return;
    }

    const nodes = xpath.select(target, this.doc) as Element[];
    const parsed = parseXmlString(fragment);

    nodes.forEach(n => {
      const index = Array.prototype.indexOf.call(n.parentNode?.childNodes, n);
      if (index >= 0) {
        n.parentNode!.removeChild(n);
        n.parentNode!.insertBefore(parsed.documentElement, n.parentNode?.childNodes[index] ?? null);
      }
    });

    this.vfs.set(this.path, this);
  }

  /**
   * Set the key/value attributes on the target.
   * Note: if the target resolves to a node list, each node will
   * have its attributes modified
   */
  setAttrs(target: string, attrs: any) {
    if (!this.doc) {
      return;
    }

    const nodes = xpath.select(target, this.doc);
    nodes.forEach((n: any) => {
      Object.keys(attrs).forEach(attr => {
        n.setAttribute(attr, attrs[attr]);
      });
    });


    this.vfs.set(this.path, this);
  }

  /**
   * Check if a node already contains a given fragment. This is a
   * rather naive way to avoid duplicating fragments
   */
  private exists(node: any, fragment: any) {
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

  private xmlCommitFn = async (file: VFSRef) => {
    return writeXml(file.getData().doc, file.getFilename());
  }
}