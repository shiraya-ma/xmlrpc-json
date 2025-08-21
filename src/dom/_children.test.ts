'use strict';
import { describe, expect, it } from 'bun:test';

import type { Node } from './node';

import { __guardCirclerReference, type WithChildren } from './_children';

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
});
