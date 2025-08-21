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

/**
 * Guards against invalid document root elements.
 * 
 * @throws DOMException
 * @internal
 */
export function __guardDocumentRoot (parent: WithChildren<Node>, child: Node) {
  // TODO
  // Document実装後に解除
  const parentIsDocument = false; // parent instanceof Document;
  // TODO
  // TextNode実装後に解除
  const childIsTextNode = false; // child instanceof TextNode;
  // TODO
  // DeclarationElement 実装後に解除
  const childIsDeclaration = true; // child instanceof DeclarationElement;

  if (parentIsDocument && childIsTextNode) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERROR, `Document cannot have a TextNode as a direct child.`);
  }

  if (childIsDeclaration && !parentIsDocument) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERROR, `DeclarationElement can only be a direct child of a Document.`);
  }

  if (childIsDeclaration && parentIsDocument && parent.children.indexOf(child) > 0) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERROR, `A DeclarationElement must be the first node in a Document.`);
  }
}
