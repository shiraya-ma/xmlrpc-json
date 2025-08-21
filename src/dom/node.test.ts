'use strict';
import { describe, expect, it } from 'bun:test';

import { _SET_PARENT_KEY, Node, type NodeConstructorOptions } from './node';
import type { WithChildren } from './_children';

describe('Node', () => {
  class TestNode extends Node {
    /** @override */
    public readonly nodeType = 'Test' as unknown as never;
    /** @override */
    public readonly rootDocument: WithChildren<Node> | null;
    /** @override */
    public readonly namespaceURI: string | null;

    constructor (options: NodeConstructorOptions & Partial<{namespaceURI: string}> = {}) {
      super(options);

      this.rootDocument = options.rootDocument ?? null;
      this.namespaceURI = options.namespaceURI ?? null;
    };

    /** @override */
    public cloneNode (deep?: boolean): TestNode {
      if (!deep) return this;

      return new TestNode({
        rootDocument: this.rootDocument ?? undefined,
        namespaceURI: this.namespaceURI ?? undefined,
      });
    };
  };

  it('should set parent', () => {
    const node = new TestNode();

    expect(node.parentNode).toBeNull();

    const dummyElement = {} as WithChildren<Node>;
    node[_SET_PARENT_KEY](dummyElement);
    expect(node.parentNode).toBe(dummyElement);
  });

  it('should clone shallowly', () => {
    const node = new TestNode();
    const clone = node.cloneNode();

    expect(clone).toBe(node);
  });

  it('should clone deeply', () => {
    const node = new TestNode();
    const clone = node.cloneNode(true);

    expect(clone).not.toBe(node);
    expect(clone).toStrictEqual(node);
  });
});
