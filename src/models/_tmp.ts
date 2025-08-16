'use strict';

import { Node, type NodeConstructorOptions } from "./node";

export class Document extends Node {
  /** @override */
  public readonly nodeType = 'Document';
  
  /** @override */
  public readonly namespaceURI: string | null;
  /** @override */
  public readonly rootDocument: Document | null;

  constructor (options: DocumentConstructorOptions) {
    super();

    this.namespaceURI = options.namespaceURI ?? null;
    this.rootDocument = this;
  };

  /** @override */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public cloneNode (deep?: boolean): Document {
    return this;
  };
};

export type DocumentConstructorOptions = NodeConstructorOptions & Partial<{

}>;

export class Element extends Node {
  /** @override */
  public readonly nodeType = 'Element';

  /** @override */
  public readonly namespaceURI: string | null;
  /** @override */
  public readonly rootDocument: Document | null;

  public readonly tagName: string;

  constructor (options: ElementConstructorOptions) {
    super();

    this.namespaceURI = options.namespaceURI ?? null;
    this.rootDocument = options.rootDocument ?? null;

    this.tagName = options.tagName;
  };

  /** @override */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public cloneNode (deep?: boolean): Element {
    return this;
  };
};

export type ElementConstructorOptions = NodeConstructorOptions & {
  tagName: string;
  children?: Node[];
  attributes?: Record<string, string>;
};
