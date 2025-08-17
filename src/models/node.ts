'use strict';
import { Element } from './element';
import { Document } from './document';

/** @internal */
export const _SET_PARENT_KEY = Symbol('setParent');

export abstract class Node {
  public abstract readonly nodeType: NodeType;
  public abstract readonly namespaceURI: string | null;
  public abstract readonly rootDocument: Document | null;

  protected _parentNode: Document | Element | null = null;
  get parentNode (): Document | Element | null {
    return this._parentNode;
  };

  public abstract cloneNode (deep?: boolean): Node;

  [_SET_PARENT_KEY](node: Element | Document | null) {
    this._parentNode = node;
  }
};

export type NodeType = 'Comment' | 'Declaration' | 'Document' | 'Element' | 'Text';

export type NodeConstructorOptions = Partial<{
  namespaceURI: string | null;
  rootDocument: Document;
}>;

export function assertNeverNodeType (type: never): never {
  throw new Error("Unexpected node type: " + (type as unknown));
};
