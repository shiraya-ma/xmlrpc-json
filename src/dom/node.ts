'use strict';

import type { WithChildren } from "./_children";

/** @internal */
export const _SET_PARENT_KEY = Symbol('setParent');

export abstract class Node {
  public abstract readonly nodeType: NodeType;
  public abstract readonly rootDocument: WithChildren<Node> | null;
  public abstract readonly namespaceURI: string | null;

  protected _parentNode: WithChildren<Node> | null = null;
  get parentNode (): WithChildren<Node>  | null {
    return this._parentNode;
  };

  constructor (options: NodeConstructorOptions) {
    this._parentNode = options.parentNode ?? null;
  };

  public abstract cloneNode (deep?: boolean): Node;

  [_SET_PARENT_KEY](node: WithChildren<Node> | null) {
    this._parentNode = node;
  }
};

export type NodeConstructorOptions = Partial<{
  rootDocument: WithChildren<Node>; // 後の実装でDocumentへ変更。
  parentNode: WithChildren<Node>;
}>;

export type NodeType = never; // 後の実装で追加する

export type WithValue<T> = T & {
  nodeValue: string | null;
};
