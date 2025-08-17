'use strict';
import { describe, expect, it } from 'bun:test';

import { CommentNode } from './comment';
import type { Document } from './document';

describe('CommentNode', () => {
  it('should initialize CommentNode', () => {
    const dummyDocument = {} as Document;

    const comment = new CommentNode({
      namespaceURI: 'https://example.com/commnet/node',
      rootDocument: dummyDocument,
      nodeValue: 'hello',
    });

    expect(comment.nodeType).toStrictEqual('Comment');
    expect(comment.namespaceURI).toStrictEqual('https://example.com/commnet/node');
    expect(comment.rootDocument).toBe(dummyDocument);
    expect(comment.nodeValue).toStrictEqual('hello');
  });

  it('should clone CommentNode', () => {
    const originalComment = new CommentNode({
      namespaceURI: 'https://example.com/commnet/node',
      rootDocument: undefined,
      nodeValue: 'hello',
    });

    const clonedComment = originalComment.cloneNode();

    expect(clonedComment).not.toBe(originalComment);
    expect(clonedComment.nodeType).toBe(originalComment.nodeType);
    expect(clonedComment.namespaceURI).toBe(originalComment.namespaceURI);
    expect(clonedComment.rootDocument).toBe(originalComment.rootDocument);
    expect(clonedComment.nodeValue).toBe(originalComment.nodeValue);
  });

  it('should not change from null is cloned nodeValue', () => {
    const originalComment = new CommentNode({
      namespaceURI: 'https://example.com/commnet/node',
      rootDocument: undefined,
      nodeValue: null,
    });

    const clonedComment = originalComment.cloneNode();

    expect(clonedComment.nodeValue).toBeNull();
  });
});