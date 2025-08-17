'use strict';
import { _SET_PARENT_KEY, assertNeverNodeType, Node, type NodeConstructorOptions, type NodeType } from "./node";
import { CommentNode, type CommentNodeConstructorOptions } from "./comment";
import { DeclarationElement, type DeclarationElementConstructorOptions } from "./declaration";
import { Element, type ElementConstructorOptions } from "./element";
import { TextNode, type TextNodeConstructorOptions } from "./text";

export class Document extends Node {
  /** @override */
  public readonly nodeType = 'Document';

  /** @override */
  public readonly namespaceURI: string | null;
  /** @override */
  public readonly rootDocument: Document | null;

  /** @override */
  get parentNode () {
    return null;
  };

  private _children: Node[] = [];
  get children () {
    return this._children;
  };

  constructor (options: DocumentConstructorOptions = {}) {
    super();

    this.namespaceURI = options.namespaceURI ?? null;
    this.rootDocument = this;
  };

  /** @override */
  public cloneNode (deep?: boolean): Document {
    const children = deep? this._children.map(child => child.cloneNode(true)): [...this._children];

    const document = new Document({
      // Node
      namespaceURI: this.namespaceURI,
      rootDocument: this.rootDocument!,
      // Document
      children,
    });

    children.forEach(child => child[_SET_PARENT_KEY](document));

    return document;
  };

  public appendChild (child: Node): Document {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    this._children.push(child);
    child[_SET_PARENT_KEY](this);
    return this;
  };

  public removeChild (child: Node): Document {
    this._children = this._children.filter(node => node !== child);
    child[_SET_PARENT_KEY](null);
    return this;
  };

  public insertBefore (newNode: Node, referenceNode: Node | null): Document {
    let index: number | null = null;

    if (referenceNode !== null) {
      index = this._children.indexOf(referenceNode);
      if (index < 0) {
        throw new Error(`${referenceNode.nodeType} is not exist in document`);
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

  public createNode(nodeType: 'Comment', options: CommentNodeConstructorOptions): CommentNode;
  public createNode(nodeType: 'Element', options: ElementConstructorOptions): Element;
  public createNode(nodeType: 'Declaration', options: DeclarationElementConstructorOptions): DeclarationElement;
  public createNode(nodeType: 'Document', options: DocumentConstructorOptions): Document;
  public createNode(nodeType: 'Text', options: TextNodeConstructorOptions): TextNode;
  public createNode (nodeType: NodeType, options: NodeConstructorOptions): Node {
    switch (nodeType) {
      case 'Comment': {
        const comment = new CommentNode({
          ...options as CommentNodeConstructorOptions,
          rootDocument: this,
          namespaceURI: this.namespaceURI,
        });
        return comment;
      }
      case 'Declaration': {
        const declaration = new DeclarationElement({
          ...options as DeclarationElementConstructorOptions,
          rootDocument: this,
          namespaceURI: this.namespaceURI,
        });
        return declaration;
      }
      case 'Document': {
        const document = new Document({
          ...options as DocumentConstructorOptions,
        });
        return document;
      }
      case 'Element': {
        const element = new Element({
          ...options as ElementConstructorOptions,
          rootDocument: this,
          namespaceURI: this.namespaceURI,
        });
        return element;
      }
      case 'Text': {
        const text = new TextNode({
          ...options as TextNodeConstructorOptions,
          rootDocument: this,
          namespaceURI: this.namespaceURI,
        });
        return text;
      }
      default: {
        return assertNeverNodeType(nodeType);
      };
    }
  }
};

export type DocumentConstructorOptions = NodeConstructorOptions & Partial<{
  children: Node[];
}>;
