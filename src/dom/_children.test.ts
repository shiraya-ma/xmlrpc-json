'use strict';
import { describe, expect, it, jest } from 'bun:test';

import {
  __guardCirclerReference,
  __guardNodeType,
  __guardNull,
  __guardParent,
  __guardParentHasChild,
  _appendChild,
  type AppendChildFunction,
  type Children,
  type RemoveChildFunction,
  type ReplaceChildFunction,
  type WithChildren,
  type WithChildrenNodeConstructorOptions
} from './_children';
import { Node, type NodeConstructorOptions } from './node';

describe('children functions', () => {
  const mockAppendChild = jest.fn();
  const mockRemoveChild = jest.fn();
  const mockReplaceChild = jest.fn();
  const mockInsertBefore = jest.fn();

  type ParentNodeConstructorOptions = WithChildrenNodeConstructorOptions;

  class ParentNode extends Node implements WithChildren<Node> {
    public readonly nodeType = 'ParentNode' as unknown as never;
    public readonly namespaceURI = null;
    public readonly rootDocument = null;

    private _children: Children;
    get children (): Node[] {
      return this._children;
    };

    public appendChild: AppendChildFunction<Node>;
    public removeChild: RemoveChildFunction<Node>;
    public replaceChild: ReplaceChildFunction<Node, Node>;
    public insertBefore: ReplaceChildFunction<Node, Node>;

    constructor (options: ParentNodeConstructorOptions) {
      super(options);
      this._children = options.children ?? [];

      this.appendChild = mockAppendChild;
      this.removeChild = mockRemoveChild;
      this.replaceChild = mockReplaceChild;
      this.insertBefore = mockInsertBefore;
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public cloneNode (_?: boolean): ParentNode {
      return this;
    };
  };

  class ChildNode extends Node {
    public readonly nodeType = 'ChildNode' as unknown as never;
    public readonly namespaceURI = null;
    public readonly rootDocument = null;

    constructor (options: NodeConstructorOptions) {
      super(options);
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public cloneNode (_?: boolean): ChildNode {
      return this;
    };
  };

  describe('_appendChild', () => {
    it('should append child to parent', () => {
      const altChild = new ChildNode({});

      const parent = new ParentNode({
        children: [ altChild ],
      });

      const child = new ChildNode({});

      const children = _appendChild(parent, child);

      expect(children).toEqual([ altChild, child ]);
    });

    it('should append child to parent as first child', () => {
      const parent = new ParentNode({
        children: [],
      });

      const child = new ChildNode({});

      const children = _appendChild(parent, child);

      expect(children).toEqual([ child ]);
    });

    it('should append child to parent and remove from previous parent', () => {
      const altParent = new ParentNode({});

      const child = new ChildNode({
        parentNode: altParent,
      });

      const parent = new ParentNode({
        children: [],
      });

      expect(child.parentNode).toEqual(altParent);

      const children = _appendChild(parent, child);

      expect(children).toEqual([ child ]);
      expect(child.parentNode).toEqual(parent);
      expect(altParent.removeChild).toBeCalledWith(child);
    });
  });
});

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

  describe('__guardParent', () => {
    it('should success if parent has property `children`', () => {
      class TempNode extends Node implements WithChildren<Node> {
        public readonly nodeType = 'TempNode' as unknown as never;
        public readonly rootDocument = null;
        public readonly namespaceURI = null;

        public readonly children: Node[] = [];
        public appendChild (child: Node): Node {
          return child;
        };
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        public removeChild (_: Node): void {};
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        public replaceChild (newChild: Node, _: Node): Node {
          return newChild;
        };
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        public insertBefore (newChild: Node, _: Node): Node {
          return newChild;
        };

        constructor () {
          super({});
        }

        public cloneNode (): TempNode {
          return this;
        }
      };

      const node = new TempNode();

      expect(__guardParent(node)).toBeUndefined();
    });

    it('should throw DOMException error if parent is not instance of Node', () => {
      const node = { children: [] as Node[] } as WithChildren<Node>;

      expect(() => {__guardParent(node)})
      .toThrow('HierarchyRequestError: The parent node is not a valid parent.');
    });

    it('should throw DOMException error if parent has not property `children`', () => {
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

      const node = new TempNode() as unknown as WithChildren<Node>;

      expect(() => {__guardParent(node)})
      .toThrow('HierarchyRequestError: The parent node is not a valid parent.');
    });
  });

  describe('__guardParentHasChild', () => {
    it('should success if parent has property `children`', () => {
      const child = {} as Node;

      const parent = { children: [child] } as WithChildren<Node>;

      expect(__guardParentHasChild(parent, child)).toBeUndefined();
    });

    it('should throw DOMException error if parent is not instance of Node', () => {
      const child = {} as Node;

      const parent = { children: [] as Node[] } as WithChildren<Node>;

      expect(() => {__guardParentHasChild(parent, child)})
      .toThrow('HierarchyRequestError: The parent does not contain the child.');
    });
  });
});
