import { formatXml, parseXml, parseXmlFragment, parseXmlString, serializeXml, writeXml } from './util/xml';
import xpath from 'xpath';
import { xml2js, js2xml } from 'xml-js';
import { VFS, VFSFile, VFSStorable } from './vfs';
import { Logger } from './logger';
import { assertParentDirs, readFileOrEmpty } from './util/fs';

export class XmlFile extends VFSStorable {
  private doc: Document | null = null;

  private namespaces: { [ns: string]: string } = {};

  constructor(private path: string, private vfs: VFS) {
    super();
  }

  async load() {
    // Don't load the file if it's already open
    if (this.vfs.isOpen(this.path)) {
      return;
    }

    try {
      this.doc = await parseXml(this.path);
    } catch (e) {
      console.error('Unable to load XML file', e);
    }

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
      this.namespaces = namespaces;
    }
  }

  getDocumentElement() {
    return this.doc?.documentElement;
  }

  private getNamespaceAttrs(): string {
    const rootNode = this.getDocumentElement();
    if (!rootNode) return '';
    const attrs: string[] = [];
    for (const attr in rootNode.attributes) {
      const attribute = rootNode.attributes[attr];
      if (attribute.name?.startsWith('xmlns')) {
        attrs.push(`${attribute.name}="${attribute.value}"`);
      }
    }
    return attrs.join(' ');
  }

  /**
   * Selects the nodes matching an XPath node-set expression.
   *
   * `allowAnyNamespaceForNoPrefix` lets an unprefixed name test match elements in any
   * namespace, not just the document's default one. That is more permissive than plain
   * XPath 1.0, but acceptable here: prefixed name tests still resolve through the
   * namespaces collected from the root element, and without it an unprefixed target
   * matches nothing at all in a document that declares a default namespace.
   *
   * An expression that evaluates to a string, a number or a boolean selects nothing.
   */
  private select(expression: string, doc: Document): Node[] {
    const result = (xpath as any).parse(expression).evaluate({
      node: doc,
      namespaces: this.namespaces,
      allowAnyNamespaceForNoPrefix: true,
    });

    if (!(result instanceof (xpath as any).XNodeSet)) {
      Logger.warn(`The target '${expression}' in ${this.path} does not evaluate to nodes, only node-set expressions are supported`);
      return [];
    }

    return result.toArray();
  }

  private selectTargetNodes(target: string, doc: Document): Element[] {
    const nodes = this.select(target, doc) as Element[];

    if (!nodes.length) {
      Logger.warn(`No nodes in ${this.path} match the target '${target}'`);
    }

    return nodes;
  }

  find(target: string): Element[] | null {
    if (!this.doc) {
      return null;
    }

    return this.select(target, this.doc) as Element[];
  }

  /**
   * Modifies every node matching the target and flags the file as modified.
   * A target that matches no node leaves the file untouched, so it isn't
   * needlessly rewritten on commit.
   */
  private modifyTargetNodes(target: string, modify: (nodes: Element[]) => void) {
    if (!this.doc) {
      return;
    }

    const nodes = this.selectTargetNodes(target, this.doc);

    if (!nodes.length) {
      return;
    }

    modify(nodes);

    this.vfs.set(this.path, this);
  }

  deleteNodes(target: string) {
    Logger.v('xml', 'deleteNodes', `at ${target}`);

    this.modifyTargetNodes(target, nodes => nodes.forEach(n => n.parentNode?.removeChild(n)));
  }

  deleteAttributes(target: string, attributes: string[]) {
    Logger.v('xml', 'deleteAttributes', `at ${target}`);

    this.modifyTargetNodes(target, nodes => nodes.forEach(n => attributes.forEach(a => n.removeAttribute(a))));
  }

  /**
   * Injects a fragment of XML as a child of the given target.
   * Note: If the target resolves to a node list, each node will
   * have the fragment appended.
   */
  injectFragment(target: string, fragment: string) {
    Logger.v('xml', 'injectFragment', `at ${target}`);

    this.modifyTargetNodes(target, nodes => {
      const docNodes = Array.from(parseXmlFragment(fragment, this.getNamespaceAttrs()));

      nodes.forEach(n =>
        docNodes.forEach(d => n.appendChild(d)),
      );
    });
  }

  /**
   * Merges a fragment of XML into the given target.
   */
  mergeFragment(target: string, fragment: string) {
    Logger.v('xml', 'mergeFragment', `at ${target}`);

    this.modifyTargetNodes(target, ([node]) => {
      const targetSerialized = serializeXml(node);
      const targetParsed = xml2js(targetSerialized.trim());
      const fragmentParsed = xml2js(fragment.trim());

      const newTree = this.mergeJsonTree(targetParsed, fragmentParsed);

      const xml = js2xml(newTree);

      const newTreeElement = parseXmlString(xml);

      for (const n of Array.prototype.slice.call(node.childNodes)) {
        node.removeChild(n);
      }
      for (const n of Array.prototype.slice.call(newTreeElement.documentElement.childNodes)) {
        node.appendChild(n);
      }
    });
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
    this.modifyTargetNodes(target, nodes => {
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
    });
  }

  /**
   * Set the key/value attributes on the target.
   * Note: if the target resolves to a node list, each node will
   * have its attributes modified
   */
  setAttrs(target: string, attrs: any) {
    Logger.v('xml', 'setAttrs', `at ${this.path} - ${target}`);

    this.modifyTargetNodes(target, nodes => nodes.forEach(n => {
      Object.keys(attrs).forEach(attr => {
        n.setAttribute(attr, attrs[attr]);
      });
    }));
  }

  private xmlCommitFn = async (file: VFSFile) => {
    const data = file.getData() as XmlFile;
    if (data.doc) {
      await assertParentDirs(file.getFilename());
      return writeXml(data.doc, file.getFilename());
    }
  };

  private xmlDiffFn = async (file: VFSFile) => {
    const data = file.getData() as XmlFile;

    return {
      old: await readFileOrEmpty(file.getFilename()),
      new: await formatXml(data.doc),
    };
  };
}
