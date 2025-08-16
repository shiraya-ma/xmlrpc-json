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

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public removeChild(child: Node): Document {
    return this;
  };
};

export type DocumentConstructorOptions = NodeConstructorOptions & Partial<{

}>;
