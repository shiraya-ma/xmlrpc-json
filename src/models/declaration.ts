'use strict';
import { Node, type NodeConstructorOptions } from "./node";
import type { Document } from "./document";
import { _getAttribute, _hasAttribute, _removeAttribute, _setAttribute, type Attributes } from "./_attributes";

export class DeclarationElement extends Node {
  /** @override */
  public readonly nodeType = 'Declaration';

  /** @override */
  public readonly namespaceURI: string | null;
  /** @override */
  public readonly rootDocument: Document | null;

  private _attributes: Attributes;
  get attributes () {
    return this._attributes;
  };

  constructor (options: DeclarationElementConstructorOptions) {
    super();

    this.namespaceURI = options.namespaceURI ?? null;
    this.rootDocument = options.rootDocument ?? null;
    this._attributes = options.attributes ?? {};
  };

  /** @override */
  /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
  public cloneNode (deep?: boolean): DeclarationElement {
    const declaration = new DeclarationElement({
      // Node
      namespaceURI: this.namespaceURI,
      rootDocument: this.rootDocument ?? undefined,
      attributes: { ...this._attributes },
    });

    return declaration;
  };

  public getAttribute (name: string): string | null {
    return _getAttribute(this._attributes, name);
  };

  public hasAttribute (name: string): boolean {
    return _hasAttribute(this._attributes, name);
  };

  public setAttribute (name: string, value: string): Attributes {
    this._attributes = _setAttribute(this._attributes, name, value);
    return this._attributes;
  };

  public removeAttribute (name: string): Attributes {
    this._attributes = _removeAttribute(this._attributes, name);
    return this._attributes;
  }
};

export type DeclarationElementConstructorOptions = NodeConstructorOptions & Partial<{
  attributes: Attributes;
}>;
