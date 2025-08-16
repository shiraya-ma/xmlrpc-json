'use strict';
import { Node, type NodeConstructorOptions } from "./node";
import type { Document } from "./_tmp";

export class CommentNode extends Node {
  /** @override */
  public readonly nodeType = 'Comment';

  /** @override */
  public readonly namespaceURI: string | null;
  /** @override */
  public readonly rootDocument: Document | null;

  private _nodeValue: string | null;
  /** @override */
  get nodeValue () {
    return this._nodeValue;
  };

  constructor (options: CommentNodeConstructorOptions) {
    super();

    this.namespaceURI = options.namespaceURI ?? null;
    this.rootDocument = options.rootDocument ?? null;
    this._nodeValue = options.nodeValue ?? null;
  };

  /** @override */
  /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
  public cloneNode (deep?: boolean): CommentNode {
    const comment = new CommentNode({
      // Node
      namespaceURI: this.namespaceURI,
      rootDocument: this.rootDocument ?? undefined,
      // Comment
      nodeValue: this._nodeValue ?? undefined,
    });

    return comment;
  };
};

export type CommentNodeConstructorOptions = NodeConstructorOptions & Partial<{
  nodeValue: string | null;
}>;
