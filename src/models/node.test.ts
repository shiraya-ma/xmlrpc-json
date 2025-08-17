'use strict';
import { describe, expect, it } from 'bun:test';

import { _SET_PARENT_KEY, assertNeverNodeType, Node, type NodeConstructorOptions, type NodeType } from './node';
import type { Document } from './document';

describe('Node', () => {
  type TempNodeConstructorObject = NodeConstructorOptions & {
    nodeType: NodeType;
    deepValue: string[];
  };

  class TempNode extends Node {
    public readonly nodeType: NodeType;
    public readonly namespaceURI: string | null;

    public readonly deepValue: string[];

    private _rootDocument: Document | null;
    get rootDocument () {
      return this._rootDocument;
    };

    constructor (options: TempNodeConstructorObject) {
      super();

      this.namespaceURI = options.namespaceURI ?? null;
      this._rootDocument = options.rootDocument ?? null;
      this.nodeType = options.nodeType;
      this.deepValue = options.deepValue;
    };

    public cloneNode (deep?: boolean): TempNode {
      const node = new TempNode({
        // Node
        namespaceURI: this.namespaceURI,
        rootDocument: this.rootDocument ?? undefined,
        // Temp
        nodeType: this.nodeType,
        deepValue: deep? [...this.deepValue]: this.deepValue,
      });

      return node;
    };
  };

  it('should set parentNode', () => {
    const node = new TempNode({
      namespaceURI: null,
      rootDocument: {} as Document,
      nodeType: 'Comment',
      deepValue: [],
    });

    expect(node.parentNode).toBeNull();

    const dummyDocument: Document = {} as Document;
    node[_SET_PARENT_KEY](dummyDocument);

    expect(node.parentNode).not.toBeNull();
    expect(node.parentNode).toBe(dummyDocument);
  });

  it('should clone shallowly', () => {
    const originalNode = new TempNode({
      namespaceURI: null,
      rootDocument: {} as Document,
      nodeType: 'Comment',
      deepValue: ['shallow', 'value'],
    });

    const clonedNode = originalNode.cloneNode(false);

    expect(clonedNode.namespaceURI).toBe(originalNode.namespaceURI);
    expect(clonedNode.rootDocument).toBe(originalNode.rootDocument);
    expect(clonedNode.deepValue).toBe(originalNode.deepValue);
    expect(clonedNode.deepValue).toEqual(originalNode.deepValue);
  });

  it('should clone deeply', () => {
    const originalNode = new TempNode({
      namespaceURI: null,
      rootDocument: {} as Document,
      nodeType: 'Comment',
      deepValue: ['deep', 'value'],
    });

    const clonedNode = originalNode.cloneNode(true);

    expect(clonedNode.namespaceURI).toBe(originalNode.namespaceURI);
    expect(clonedNode.rootDocument).toBe(originalNode.rootDocument);
    expect(clonedNode.deepValue).not.toBe(originalNode.deepValue);
    expect(clonedNode.deepValue).toEqual(originalNode.deepValue);
  });
});

describe('assertNeverNodeType', () => {
  it('should throw error', () => {
    expect(() => assertNeverNodeType('hello' as never))
      .toThrowError('Unexpected node type: hello');
  });
});
