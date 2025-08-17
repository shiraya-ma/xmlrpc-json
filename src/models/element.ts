'use strict';
import { _SET_PARENT_KEY, Node, type NodeConstructorOptions } from "./node";
import type { Document } from "./document";
import { _getAttribute, _hasAttribute, _removeAttribute, _setAttribute, type Attributes } from "./_attributes";

export class Element extends Node {
  /** @override */
  public readonly nodeType = 'Element';
  /** @override */
  public readonly nodeValue = null;

  public readonly tagName: string;
  /** @override */
  public readonly namespaceURI: string | null;
  /** @override */
  public readonly rootDocument: Document | null;
  
  public readonly prefix: string | null;
  public readonly localName: string;

  private _children: Node[];
  get children (): Node[] {
    return this._children;
  };

  private _attributes: Attributes;
  get attributes () {
    return this._attributes;
  };

  constructor (options: ElementConstructorOptions) {
    super();

    this.tagName = options.tagName;
    this.namespaceURI = options.namespaceURI ?? null;
    this.rootDocument = options.rootDocument ?? null;
    this._children = options.children ?? [];
    this._attributes = options.attributes ?? {};

    if (/:/.test(this.tagName)) {
      const [prefix, ...nodes] = this.tagName.split(/:/g);
      this.prefix = prefix!;
      this.localName = nodes.join(':');
    }
    else {
      this.prefix = null;
      this.localName = this.tagName;
    }
  };

  /** @override */
  public cloneNode (deep?: boolean): Element {
    const children = deep? this._children.map(child => child.cloneNode(true)): [...this._children];
    const attributes = { ...this._attributes };

    const element = new Element({
      // Node
      namespaceURI: this.namespaceURI,
      rootDocument: this.rootDocument ?? undefined,
      // Element
      tagName: this.tagName,
      children,
      attributes,
    });

    children.forEach(child => child[_SET_PARENT_KEY](element));

    return element;
  };

  public appendChild (child: Node): Element {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    this._children.push(child);
    child[_SET_PARENT_KEY](this);
    return this;
  };

  public removeChild (child: Node): Element {
    this._children = this._children.filter(node => node !== child);
    child[_SET_PARENT_KEY](null);
    return this;
  };

  public insertBefore (newNode: Node, referenceNode: Node | null): Element {
    let index: number | null = null;

    if (referenceNode !== null) {
      index = this._children.indexOf(referenceNode);
      if (index < 0) {
        throw new Error(`${referenceNode.nodeType} does not exist in <${this.tagName}>`);
      }
    }

    if (newNode.parentNode) {
      newNode.parentNode.removeChild(newNode);
    }

    if (index === null) {
      this._children.push(newNode);
    }
    else {
      this._children.splice(index, 0, newNode);
    }

    newNode[_SET_PARENT_KEY](this);
    return this;
  };

  public getAttribute (name: string): string | null {
    return _getAttribute(this._attributes, name);
  };

  public hasAttribute (name: string): boolean {
    return _hasAttribute(this._attributes, name);
  };

  public setAttribute (name: string, value: string): void {
    this._attributes = _setAttribute(this._attributes, name, value);
  };

  public removeAttribute (name: string): void {
    this._attributes = _removeAttribute(this._attributes, name);
  }
};

export type ElementConstructorOptions = NodeConstructorOptions & {
  tagName: string;
  children?: Node[];
  attributes?: Attributes;
};
