'use strict';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';

import { Document } from './document';
import { CommentNode } from './comment';
import { Element } from './element';
import { DeclarationElement } from './declaration';
import { TextNode } from './text';

describe('Document', () => {
  const otherDocument = new Document({
    // Node
    namespaceURI: 'https://example.com/element/node',
    // rootDocument: null
    // Document
    children: [],
  });
  
  afterEach(() => {
    otherDocument.children.forEach(child => {
      otherDocument.removeChild(child);
    });
  });

  it('should initialize Document', () => {
    const document = new Document({
      // Node
      namespaceURI: 'https://example.com/document/node',
      // rootDocument:
      // Document
      children: [],
    });

    expect(document.nodeType).toStrictEqual('Document');
    expect(document.namespaceURI).toStrictEqual('https://example.com/document/node');
    expect(document.rootDocument).toBe(document);
    expect(document.children).toStrictEqual([]);
  });
  
  it('should clone shallowly', () => {
    const originalDoc = new Document({
      // Node
      namespaceURI: 'https://example.com/document/node',
      // rootDocument:
      // Document
      children: [],
    });

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: originalDoc,
      // Text
      nodeValue: 'hello world!',
    });

    originalDoc.appendChild(text);

    const clonedDoc = originalDoc.cloneNode(false);

    expect(clonedDoc).not.toBe(originalDoc);
    expect(clonedDoc.namespaceURI).toBe(originalDoc.namespaceURI);
    expect(clonedDoc.rootDocument).toBe(clonedDoc);

    expect(clonedDoc.children).toStrictEqual(originalDoc.children);
    clonedDoc.children.forEach((clonedhild, index) => {
      expect(clonedhild).toBe(originalDoc.children[index]!);
    });
  });

  it('should clone deeply', () => {
    const originalDoc = new Document({
      // Node
      namespaceURI: 'https://example.com/document/node',
      // rootDocument:
      // Document
      children: [],
    });

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: originalDoc,
      // Text
      nodeValue: 'hello world!',
    });

    originalDoc.appendChild(text);

    const clonedDoc = originalDoc.cloneNode(true);

    expect(clonedDoc).not.toBe(originalDoc);
    expect(clonedDoc.namespaceURI).toBe(originalDoc.namespaceURI);
    expect(clonedDoc.rootDocument).toBe(clonedDoc);

    expect(clonedDoc.children).toStrictEqual(originalDoc.children);
    clonedDoc.children.forEach((clonedhild, index) => {
      expect(clonedhild).not.toBe(originalDoc.children[index]!);
    });
  });

  it('should append child', () => {
    const document = new Document({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Document
      children: [],
    });
    expect(document.children).toStrictEqual([]);

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'hello world!',
    });
    document.appendChild(text);
    expect(document.children).toStrictEqual([text]);

    expect(text.parentNode).toBe(document);
  });

  it('should append from otherDocument', () => {
    const document = new Document({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Document
      children: [],
    });
    expect(document.children).toStrictEqual([]);

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'hello world!',
    });
    otherDocument.appendChild(text);
    expect(text.parentNode).toBe(otherDocument);

    document.appendChild(text);
    expect(text.parentNode).toBe(document);
    expect(document.children).toStrictEqual([text]);
  });

  it('should remove child', () => {
    const document = new Document({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Document
      children: [],
    });
    expect(document.children).toStrictEqual([]);

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'hello world!',
    });
    document.appendChild(text);
    expect(document.children).toStrictEqual([text]);

    document.removeChild(text);
    expect(document.children).toStrictEqual([]);
    expect(text.parentNode).toBeNull();
  });

  it('should insert before child', () => {
    const document = new Document({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Document
      children: [],
    });
    const world = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'world!',
    });
    document.appendChild(world);
    expect(document.children).toStrictEqual([world]);

    const hello = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'hello',
    });
    document.insertBefore(hello, world);
    expect(document.children).toStrictEqual([hello, world]);
  });

  it('should insert from otherDocument', () => {
    const document = new Document({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Document
      children: [],
    });
    const world = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'world!',
    });
    document.appendChild(world);
    expect(document.children).toStrictEqual([world]);

    const hello = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'hello',
    });
    otherDocument.appendChild(hello);
    expect(hello.parentNode).toBe(otherDocument);

    document.insertBefore(hello, world);
    expect(hello.parentNode).toBe(document);
    expect(document.children).toStrictEqual([hello, world]);
  });

  it('should append if referenceNode is null', () => {
    const document = new Document({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Document
      children: [],
    });
    const world = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'world!',
    });
    document.appendChild(world);
    expect(document.children).toStrictEqual([world]);

    const hello = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'hello',
    });
    document.insertBefore(hello, null);
    expect(document.children).toStrictEqual([world, hello]);
  });

  it('should append if referenceNode is missing', () => {
    const document = new Document({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Document
      children: [],
    });
    const world = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'world!',
    });
    document.appendChild(world);
    expect(document.children).toStrictEqual([world]);

    const dummy = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'this is dummy',
    });

    const hello = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      // rootDocument: null
      // Text
      nodeValue: 'hello',
    });

    expect(() => {
      document.insertBefore(hello, dummy)
    })
      .toThrowError('Text does not exist in document');
  });

  describe('Document.createNode', () => {
    let document: Document;
    beforeEach(() => {
      document = new Document({
        // Node
        namespaceURI: 'https://example.com/document/node',
        // rootDocument:
        // Document
        children: [],
      });
    });

    it('should create Comment', () => {
      const comment = document.createNode('Comment', {
        nodeValue: 'hello world!',
      });

      expect(comment).toBeInstanceOf(CommentNode);
      expect(comment.nodeType).toBe('Comment');
      expect(comment.rootDocument).toBe(document);
      expect(comment.namespaceURI).toBe(document.namespaceURI);
      expect(comment.nodeValue).toStrictEqual('hello world!');
    });

    it('should create Element', () => {
      const element = document.createNode('Element', {
        tagName: 'element',
      });

      expect(element).toBeInstanceOf(Element);
      expect(element.nodeType).toBe('Element');
      expect(element.rootDocument).toBe(document);
      expect(element.namespaceURI).toBe(document.namespaceURI);
      expect(element.tagName).toStrictEqual('element');
    });

    it('should create DeclarationElement', () => {
      const declaration = document.createNode('Declaration', {
        attributes: {
          attr: 'value',
        },
      });

      expect(declaration).toBeInstanceOf(DeclarationElement);
      expect(declaration.nodeType).toBe('Declaration');
      expect(declaration.rootDocument).toBe(document);
      expect(declaration.namespaceURI).toBe(document.namespaceURI);
      expect(declaration.attributes).toStrictEqual({
        attr: 'value',
      });
    });

    it('should create Document', () => {
      const doc = document.createNode('Document', {
        namespaceURI: 'https://example.com/new/document/node',
        // tagName: 'element',
      });

      expect(doc).toBeInstanceOf(Document);
      expect(doc.nodeType).toBe('Document');
      expect(doc.rootDocument).toBe(doc);
      expect(doc.namespaceURI).toBe('https://example.com/new/document/node');
      expect(doc.children).toStrictEqual([]);
    });

    it('should create Text', () => {
      const text = document.createNode('Text', {
        nodeValue: 'hello world!',
      });

      expect(text).toBeInstanceOf(TextNode);
      expect(text.nodeType).toBe('Text');
      expect(text.rootDocument).toBe(document);
      expect(text.namespaceURI).toBe(document.namespaceURI);
      expect(text.nodeValue).toStrictEqual('hello world!');
    });
  });
});
