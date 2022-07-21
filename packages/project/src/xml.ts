import { formatXml, parseXml, parseXmlString, serializeXml, writeXml } from './util/xml';
import xpath, { XPathSelect } from 'xpath';
import MergeXML from 'mergexml';
import { difference, isEqual, mergeWith } from 'lodash';
import { xml2js, js2xml } from 'xml-js';
import { VFS, VFSFile, VFSStorable } from './vfs';
import { readFile } from 'fs-extra';

const toArray = (o: any[]) => Array.prototype.slice.call(o || []);

export class XmlFile extends VFSStorable {
  private doc: Document | null = null;

  private select: XPathSelect = xpath.select;

  constructor(private path: string, private vfs: VFS) {
    super();
  }

  async load() {
    this.doc = await parseXml(this.path);
    this.vfs.open(this.path, this, this.xmlCommitFn, this.xmlDiffFn);

    const rootNode = this.getDocumentElement();
    if (rootNode) {
      const namespaces: { [ns: string]: string } = {};

      for (const attr in rootNode.attributes) {
        const attribute = rootNode.attributes[attr];
        if (!attribute.name) {
          continue;
        }

        if (attribute.name.indexOf('xmlns') >= 0) {
          const nsName = attribute.name.split(':').slice(1).join();
          namespaces[nsName] = attribute.value ?? '';
        }
      }
      this.select = xpath.useNamespaces(namespaces);
    }
  }

  getDocumentElement() {
    return this.doc?.documentElement;
  }

  find(target: string): Element[] | null {
    if (!this.doc) {
      return null;
    }

    return this.select?.(target, this.doc) as Element[];
  }

  deleteNodes(target: string) {
    if (!this.doc) {
      return;
    }

    const nodes = this.select?.(target, this.doc) as Element[];
    nodes.forEach(n => n.parentNode?.removeChild(n));

    this.vfs.set(this.path, this);
  }

  deleteAttributes(target: string, attributes: string[]) {
    if (!this.doc) {
      return;
    }

    const nodes = this.select?.(target, this.doc) as Element[];
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

    const nodes = this.select?.(target, this.doc) as Element[];
    const parsed = parseXmlString(fragment);
    const docNodes = parsed.childNodes ?? [];

    nodes.forEach(n =>
      Array.prototype.forEach.call(docNodes, d => n.appendChild(d)),
    );

    this.vfs.set(this.path, this);
  }

  /**
   * Merges a fragment of XML into the given target.
   */
  mergeFragment(target: string, fragment: string) {
    if (!this.doc) {
      return;
    }

    const nodes = this.select?.(target, this.doc) as Element[];

    console.log('Checking against', nodes.length, 'nodes');
    const parsed = parseXmlString(fragment);

    const docNodes = parsed.childNodes ?? [];

    nodes.forEach(n => {
      Array.prototype.forEach.call(docNodes, doc => {
        if (n.tagName !== doc.tagName || n.nodeName !== doc.nodeName) {
          return;
        }

        console.log('Checking', doc.tagName, 'against', n.tagName);

        let existingChild = null;
        const attrsToCheck = doc.attributes;
        for (const attr in attrsToCheck) {
          const checkAttr = attrsToCheck[attr];
          const nodeAttr = n.attributes[attr as any];
          if (typeof nodeAttr === 'function') {
            continue;
          }
          if (checkAttr.name && nodeAttr.name === checkAttr.name && nodeAttr.value === checkAttr.value) {
            // Greedily match against the first matching attr
            existingChild = n;
            break;
          }
        }

        if (existingChild) {
          console.log(`Found match`);
          console.log(`<${n.tagName} ${n.attributes[0].name}="${n.attributes[0].value}" />`);
          console.log(`<${existingChild.tagName} ${existingChild.attributes[0].name}="${existingChild.attributes[0].value}" />`);
        }

        // If the child exists, replace its children with this one
        if (existingChild) {
          for (const n of Array.prototype.slice.call(existingChild.childNodes)) {
            existingChild.removeChild(n);
          }
          for (const o of Array.prototype.slice.call(doc.childNodes)) {
            existingChild.appendChild(o);
          }
          // TODO: merge attributes
        } else {
          console.log('DOING AN APPEND HERE', `<${doc.tagName} ${doc.attributes[0]?.name}="${doc.attributes[0]?.value}" />`);
          // n.appendChild(doc);
          // Child doesn't exist, we need to inject here?
        }
      });
    });

    this.vfs.set(this.path, this);
  }

  async mergeTrees(target: string, fragment: string) {
    if (!this.doc) {
      return;
    }

    // Get the target element
    const node = this.select?.(target, this.doc) as Element[];

    if (!node.length) {
      return;
    }

    const targetSerialized = serializeXml(node[0]);
    const targetParsed = xml2js(targetSerialized);
    const fragmentParsed = xml2js(fragment);

    const newTree = await this.mergeJsonTree(targetParsed, fragmentParsed);

    const xml = js2xml(newTree);

    const newTreeElement = parseXmlString(xml);

    for (const n of Array.prototype.slice.call(node[0].childNodes)) {
      node[0].removeChild(n);
    }
    for (const n of Array.prototype.slice.call(newTreeElement.documentElement.childNodes)) {
      node[0].appendChild(n);
    }
  }

  mergeJsonTree(target: any, fragment: any) {
    this._mergeJson(target, fragment);

    return target;
  }

  // Recursively merge nodes with some heuristics based on
  // likely merge expectations
  _mergeJson(target: any, fragment: any) {
    for (const e of fragment.elements) {
      let child: Element | null = null;

      for (const t of target.elements) {
        if (e.name && t.name && e.name === t.name && isEqual(e.attributes, t.attributes)) {
          child = t;
          break;
        }
      }

      if (!child) {
        // If these are both terminal text nodes, replace the text
        // content instead of appending
        if (target.elements && 
            target.elements.every((a: any) => a.type === 'text') &&
            e.type === 'text') {
          target.elements = [e];
        } else {
          target.elements.push(e);
        }
      } else if (e.elements) {
        this._mergeJson(child, e);
      }
    }

    return fragment;
  }

  /**
   * Replaces a given target with the given fragment
   */
  replaceFragment(target: string, fragment: string) {
    if (!this.doc) {
      return;
    }

    const nodes = this.select?.(target, this.doc) as Element[];
    const parsed = parseXmlString(fragment);

    nodes.forEach(n => {
      const index = Array.prototype.indexOf.call(n.parentNode?.childNodes, n);
      if (index >= 0) {
        n.parentNode!.removeChild(n);
        n.parentNode!.insertBefore(
          parsed.documentElement,
          n.parentNode?.childNodes[index] ?? null,
        );
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

    const nodes = this.select?.(target, this.doc) ?? [];
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

  private xmlCommitFn = async (file: VFSFile) => {
    const data = file.getData() as XmlFile;
    return writeXml(data.doc, file.getFilename());
  };

  private xmlDiffFn = async (file: VFSFile) => {
    const data = file.getData() as XmlFile;
    const xmlString = await formatXml(data.doc);
    const currentString = await readFile(file.getFilename(), {
      encoding: 'utf-8',
    });

    return {
      old: currentString,
      new: xmlString,
    };
  };
}
