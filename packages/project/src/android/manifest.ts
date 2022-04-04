import { parseXml, parseXmlString, serializeXml, writeXml } from "../util/xml";
import { writeFile } from '@ionic/utils-fs';
import xpath from 'xpath';
import { difference, isEqual, isObject, transform } from 'lodash';
import { VFS, VFSRef } from "../vfs";

const toArray = (o: any[]) => Array.prototype.slice.call(o || []);

export class AndroidManifest {
  private doc: Document | null = null;

  constructor(private path: string, private vfs: VFS) {
  }

  async load() {
    this.doc = await parseXml(this.path);
    this.vfs.open(this.path, this.doc, this.manifestCommitFn);
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
    const doc = parseXmlString(fragment).documentElement;

    nodes.forEach(n => n.appendChild(doc));

    this.vfs.set(this.path, this.doc);
  }

  mergeFragment(target: string, fragment: string) {
    if (!this.doc) {
      return;
    }

    const nodes = xpath.select(target, this.doc) as Element[];
    const doc = parseXmlString(fragment).documentElement;

    nodes.forEach(n => {
      const existingChild = Array.prototype.find.call(n.childNodes, (en) => en.nodeName === doc.nodeName);

      // If the child doesn't exist, append it and finish
      if (!existingChild || !this.exists(n, doc)) {
        n.appendChild(doc);
      } else {
        // Child exists, so merge the two nodes
        this._mergeNodes(existingChild, doc);
      }
    });

    this.vfs.set(this.path, this.doc);
  }

  _mergeNodes(oldEl: Element, newEl: Element) {
    Array.prototype.forEach.call(newEl.childNodes, (n) => {
      const exists = this.exists(oldEl, n);
      if (!exists) {
        oldEl.appendChild(n);
      }
      // TODO: make this recursive?
    });
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


    this.vfs.set(this.path, this.doc);
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

  private manifestCommitFn = async (file: VFSRef) => {
    return writeXml(file.getData(), file.getFilename());
  }
}