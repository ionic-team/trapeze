import { formatXml, parseXml, parseXmlString, serializeXml, writeXml } from './util/xml';
import xpath, { XPathSelect } from 'xpath';
import { xml2js, js2xml } from 'xml-js';
import { VFS, VFSFile, VFSStorable } from './vfs';
import { readFile } from 'fs-extra';
import { Logger } from './logger';

export class XmlFile extends VFSStorable {
  private doc: Document | null = null;

  private select: XPathSelect = xpath.select;

  constructor(private path: string, private vfs: VFS) {
    super();
  }

  async load() {
    // Don't load the file if it's already open
    if (this.vfs.isOpen(this.path)) {
      return;
    }

    this.doc = await parseXml(this.path);
    Logger.v('xml', 'load', `at ${this.path}`);
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
      Logger.v('xml', 'load', `Found root namespaces in XML file:`, Object.values(namespaces).join(' '));
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

    Logger.v('xml', 'deleteNodes', `at ${target}`);

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

    Logger.v('xml', 'deleteAttributes', `at ${target}`);

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

    Logger.v('xml', 'injectFragment', `at ${target}`);

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

    // Get the target element
    const node = this.select?.(target, this.doc) as Element[];

    Logger.v('xml', 'mergeFragment', `at ${target}`);

    if (!node.length) {
      return;
    }


    const targetSerialized = serializeXml(node[0]);
    const targetParsed = xml2js(targetSerialized.trim());
    const fragmentParsed = xml2js(fragment.trim());

    const newTree = this.mergeJsonTree(targetParsed, fragmentParsed);

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
        const attrs = e.attributes ?? [];
        const attrsMatch = Object.keys(attrs).every((a: string) => (t.attributes ?? {})[a] === attrs[a]);

        // Match the same tag names and, if the node to be merged has attributes, make sure
        // every attribute matches with the source tag to count this as a match (heuristic)
        if (e.name && t.name && e.name === t.name &&
           (Object.keys(attrs).length > 0 ? attrsMatch : true)) {
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
        const parent = n.parentNode;
        parent!.removeChild(n);
        parent!.insertBefore(
          parsed.documentElement,
          parent?.childNodes[index] ?? null,
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

    Logger.v('xml', 'setAttrs', `at ${this.path} - ${target}`);

    const nodes = this.select?.(target, this.doc) ?? [];
    nodes.forEach((n: any) => {
      Object.keys(attrs).forEach(attr => {
        n.setAttribute(attr, attrs[attr]);
      });
    });

    this.vfs.set(this.path, this);
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
