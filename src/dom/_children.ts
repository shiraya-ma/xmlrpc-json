'use strict';
import { DOMException } from "./errors";
import type { Node, NodeConstructorOptions } from "./node";

export type WithChildren<T = {}> = T & {
  children: Node[];

  appendChild: AppendChildFunction;
  removeChild: RemoveChildFunction;
  replaceChild: ReplaceChildFunction;
  insertBefore: InsertBeforeFunction;
};

export type AppendChildFunction = (node: Node) => WithChildren<Node>;
export type RemoveChildFunction = (node: Node) => WithChildren<Node>;
export type ReplaceChildFunction = (newNode: Node, oldNode: Node) => WithChildren<Node>;
export type InsertBeforeFunction = (newNode: Node, refNode: Node) => WithChildren<Node>;

export type WithChildrenNodeConstructorOptions = NodeConstructorOptions & Partial<{
  children: Node[];
}>;

/**
 * Guards against circular references where the child element is an ancestor of the parent element.
 * 
 * @throws DOMException
 * @internal
 */
export function __guardCirclerReference (parent: WithChildren<Node>, child: Node) {
  let _parent = parent.parentNode;
  while (_parent !== null) {
    if (_parent === child) { // If the child's parent is the same as the parent, it's a circular reference.
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERROR, `The new child is an ancestor of the parent.`);
    }
    _parent = _parent.parentNode;
  };
};
