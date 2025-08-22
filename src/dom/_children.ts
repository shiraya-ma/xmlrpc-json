'use strict';
import { DOMException } from "./errors";
import { _SET_PARENT_KEY, Node, type NodeConstructorOptions } from "./node";

export type Children = Node[];

export type WithChildren<T = {}> = T & {
  children: Children;

  appendChild: AppendChildFunction<Node>;
  removeChild: RemoveChildFunction<Node>;
  replaceChild: ReplaceChildFunction<Node, Node>;
  insertBefore: InsertBeforeFunction<Node, Node>;
};

/** @internal */
export const _appendChild = (parent: WithChildren<Node>, child: Node): Children => {
  __guardParent(parent);
  __guardNodeType(child);
  __guardDocumentRoot(parent, child);
  __guardCirclerReference(parent, child);

  if (child.parentNode) { 
    child.parentNode.removeChild(child);
  }

  const children: Children = [
    ...parent.children,
    child,
  ];

  child[_SET_PARENT_KEY](parent);

  return children;
};

/** @internal */
export const _removeChild = (parent: WithChildren<Node>, child: Node): Children => {
  __guardNull(child);
  __guardParent(parent);
  __guardParentHasChild(parent, child);

  const children: Children = parent.children.filter(node => node !== child);

  child[_SET_PARENT_KEY](null);
  
  return children;
};


export type AppendChildFunction<AChild extends Node> = (aChild: AChild) => AChild;
export type RemoveChildFunction<AChild extends Node> = (aChild: AChild) => void;
export type ReplaceChildFunction<NewChild extends Node, OldChild extends Node> = (newChild: NewChild, oldChild: OldChild) => NewChild;
export type InsertBeforeFunction<NewChild extends Node, ReferenceChild extends Node> = (newChild: NewChild, referenceChild: ReferenceChild) => NewChild;

export type WithChildrenNodeConstructorOptions = NodeConstructorOptions & Partial<{
  children: Children;
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
  const childIsDeclaration = false; // child instanceof DeclarationElement;

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

/**
 * Ensures that the given node is an instance of `Node`.
 * 
 * @throws DOMException
 * @internal
 */
export function __guardNodeType (node: Node): void {
  if (!(node instanceof Node)) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERROR, `The node is not an instance of Node.`);
  }
};

/**
 * Ensures that the given node is not null.
 * 
 * @throws TypeError
 * @internal
 */
export function __guardNull (node: Node): void {
  if (node === null) {
    throw new TypeError('The node is null.');
  };
};

/**
 * Ensures that the given node can be a parent (i.e., can have children).
 * 
 * @throws DOMException
 * @internal
 */
export function __guardParent (node: WithChildren<Node>): void {
  const nodeIsNode = node instanceof Node;
  const nodeHasChildren = 'children' in node;

  if (nodeIsNode && nodeHasChildren) return;

  throw new DOMException(DOMException.HIERARCHY_REQUEST_ERROR, `The parent node is not a valid parent.`);
};

/**
 * Ensures that the parent element contains the specified child element.
 * 
 * @throws DOMException
 * @internal
 */
export function __guardParentHasChild (parent: WithChildren<Node>, child: Node) {
  if (!parent.children.includes(child)) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERROR, `The parent does not contain the child.`);
  }
};
