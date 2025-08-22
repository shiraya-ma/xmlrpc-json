'use strict';
import { describe, expect, it } from 'bun:test';

import {
  __guardCirclerReference,
  __guardNodeType,
  __guardNull,
  type WithChildren
} from './_children';
import { Node } from './node';

describe('guard functions', () => {
  describe('__guardCirclerReference', () => {
    const genNodeWithChildren = (name: string, parentNode: WithChildren<Node> | null = null) => {
      return { name, parentNode, children: [] as Node[] } as WithChildren<Node> & { name: string };
    };

    it('should be success if parent is not parent of child', () => {
      const child = genNodeWithChildren('child');
      const parent = genNodeWithChildren('parent');

      expect(__guardCirclerReference(parent, child)).toBeUndefined();
    });

    it('should throw DOMException error if parent is parent of child', () => {
      const child = genNodeWithChildren('child');
      const parent = genNodeWithChildren('parent', child);
      child.children.push(parent);
      
      expect(() => __guardCirclerReference(parent, child))
      .toThrowError('HierarchyRequestError: The new child is an ancestor of the parent.');
    });

    it('should throw DOMException error if ancestor is ancestor of child', () => {
      const child = genNodeWithChildren('child');

      const ancestor = genNodeWithChildren('ancestor', child);
      child.children.push(ancestor);

      const parent = genNodeWithChildren('parent', ancestor);
      ancestor.children.push(parent);

      expect(() => __guardCirclerReference(parent, child))
      .toThrowError('HierarchyRequestError: The new child is an ancestor of the parent.');
    });
  });

  describe('__guardDocumentRoot', () => {
    it.todo('should success if parent is document and child is not text node', () => {});

    it.todo('should success if parent is not document and child is text node', () => {});

    it.todo('should success if parent is document and first child is declaration element', () => {});

    it.todo('should throw DOMException error if text node`s parent is document', () => {});

    it.todo('should throw DOMException error if eclaration element`s parent is not document', () => {});

    it.todo('should throw DOMException error if parent is document and first child is not declaration element', () => {});
  });

  describe('__guardNodeType', () => {
    class TempNode extends Node {
      public readonly nodeType = 'TempNode' as unknown as never;
      public readonly rootDocument = null;
      public readonly namespaceURI = null;

      constructor () {
        super({});
      }

      public cloneNode (): TempNode {
        return this;
      }
    };

    it('should success if node is instance of Node', () => {
      const node = new TempNode();

      expect(__guardNodeType(node)).toBeUndefined();
    });

    it('should throw DOMException error if node is instance of Node', () => {
      const node = {} as Node;

      expect(() => {__guardNodeType(node)})
      .toThrow('HierarchyRequestError: The node is not an instance of Node.');
    });
  });

  describe('__guardNull', () => {
    class TempNode extends Node {
      public readonly nodeType = 'TempNode' as unknown as never;
      public readonly rootDocument = null;
      public readonly namespaceURI = null;

      constructor () {
        super({});
      }

      public cloneNode (): TempNode {
        return this;
      }
    };

    it('should success if node is not null', () => {
      const node = new TempNode();

      expect(__guardNull(node)).toBeUndefined();
    });

    it('should throw DOMException error if node is null', () => {
      const node = null as unknown as Node;

      expect(() => {__guardNull(node)})
      .toThrow('The node is null');
    });
  });
});
