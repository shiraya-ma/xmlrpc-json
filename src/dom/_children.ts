'use strict';
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
