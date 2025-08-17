'use strict';
import { Node, type NodeConstructorOptions } from "./node";
import type { Document } from "./document";

export class TextNode extends Node {
  /** @override */
  public readonly nodeType = 'Text';

  /** @override */
  public readonly namespaceURI: string | null;
  /** @override */
  public readonly rootDocument: Document | null;

  private _nodeValue: string;
  get nodeValue () {
    return this._nodeValue;
  };
  set nodeValue (value: string) {
    if (typeof value !== 'string') throw new Error('Unexpected value type: ' + (typeof value));

    this._nodeValue = value;
  }

  constructor (options: TextNodeConstructorOptions) {
    super();

    this.namespaceURI = options.namespaceURI ?? null;
    this.rootDocument = options.rootDocument ?? null;
    this._nodeValue = options.nodeValue ?? '';
  };

  /** @override */
  /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
  public cloneNode (deep?: boolean): TextNode {
    const text = new TextNode({
      // Node
      namespaceURI: this.namespaceURI,
      rootDocument: this.rootDocument ?? undefined,
      // Text
      nodeValue: this._nodeValue ?? undefined,
    });

    return text;
  };
};

export type TextNodeConstructorOptions = NodeConstructorOptions & Partial<{
  nodeValue: string;
}>;
