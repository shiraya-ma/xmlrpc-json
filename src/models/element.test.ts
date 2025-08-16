'use strict';
import { afterEach, describe, expect, it } from 'bun:test';

import { Element } from './element';
import type { Document } from './_tmp';
import { TextNode } from './text';
import type { Attributes } from './_attributes';

describe('Element', () => {
  const dummyDocument = {} as Document;

  const otherElement = new Element({
    // Node
    namespaceURI: 'https://example.com/element/node',
    rootDocument: dummyDocument,
    // Element
    tagName: 'element',
  });

  afterEach(() => {
    otherElement.children.forEach(child => {
      otherElement.removeChild(child);
    });
  });

  it('should initialize Element', () => {
    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
    });

    expect(element.nodeType).toStrictEqual('Element');
    expect(element.namespaceURI).toStrictEqual('https://example.com/element/node');
    expect(element.rootDocument).toBe(dummyDocument);
    expect(element.nodeValue).toBeNull();
    expect(element.tagName).toStrictEqual('element');
    expect(element.prefix).toBeNull();
    expect(element.localName).toStrictEqual('element');
    expect(element.attributes).toBeEmptyObject();
    expect(element.children).toStrictEqual([]);
  });

  it('should clone shallowly', () => {
    const originalElm = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
      children: [],
      attributes: {
        attr: 'value',
      },
    });

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello world!',
    });

    originalElm.appendChild(text);

    const clonedElm = originalElm.cloneNode(false);

    expect(clonedElm).not.toBe(originalElm);
    expect(clonedElm.namespaceURI).toBe(originalElm.namespaceURI);
    expect(clonedElm.rootDocument).toBe(originalElm.rootDocument);
    expect(clonedElm.tagName).toBe(originalElm.tagName);
    expect(clonedElm.prefix).toBe(originalElm.prefix);
    expect(clonedElm.localName).toBe(originalElm.localName);

    expect(clonedElm.attributes).toStrictEqual(originalElm.attributes);
    expect(clonedElm.attributes).not.toBe(originalElm.attributes);
    expect(clonedElm.children).toStrictEqual(originalElm.children);
    clonedElm.children.forEach((clonedhild, index) => {
      expect(clonedhild).toBe(originalElm.children[index]!);
    });
  });

  it('should clone deeply', () => {
    const originalElm = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
      children: [],
      attributes: {
        attr: 'value',
      },
    });

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello world!',
    });

    originalElm.appendChild(text);

    const clonedElm = originalElm.cloneNode(true);

    expect(clonedElm).not.toBe(originalElm);
    expect(clonedElm.namespaceURI).toBe(originalElm.namespaceURI);
    expect(clonedElm.rootDocument).toBe(originalElm.rootDocument);
    expect(clonedElm.tagName).toBe(originalElm.tagName);
    expect(clonedElm.prefix).toBe(originalElm.prefix);
    expect(clonedElm.localName).toBe(originalElm.localName);

    expect(clonedElm.attributes).toStrictEqual(originalElm.attributes);
    expect(clonedElm.attributes).not.toBe(originalElm.attributes);
    expect(clonedElm.children).toStrictEqual(originalElm.children);
    clonedElm.children.forEach((clonedhild, index) => {
      expect(clonedhild).not.toBe(originalElm.children[index]!);
    });
  });

  it('should append child', () => {
    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
    });
    expect(element.children).toStrictEqual([]);

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello world!',
    });
    element.appendChild(text);
    expect(element.children).toStrictEqual([text]);

    expect(text.parentNode).toBe(element);
  });

  it('should append from otherElement', () => {
    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
    });
    expect(element.children).toStrictEqual([]);

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello world!',
    });
    otherElement.appendChild(text);
    expect(text.parentNode).toBe(otherElement);

    element.appendChild(text);
    expect(text.parentNode).toBe(element);
    expect(element.children).toStrictEqual([text]);
  });

  it('should remove child', () => {
    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
    });
    expect(element.children).toStrictEqual([]);

    const text = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello world!',
    });
    element.appendChild(text);
    expect(element.children).toStrictEqual([text]);

    element.removeChild(text);
    expect(element.children).toStrictEqual([]);
    expect(text.parentNode).toBeNull();
  });

  it('should insert before child', () => {
    const world = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'world!',
    });

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
      children: [
        world,
      ],
    });
    expect(element.children).toStrictEqual([world]);

    const hello = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello',
    });
    element.insertBefore(hello, world);
    expect(element.children).toStrictEqual([hello, world]);
  });

  it('should insert from otherElement', () => {
    const world = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'world!',
    });

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
      children: [world],
    });
    expect(element.children).toStrictEqual([world]);

    const hello = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello',
    });
    otherElement.appendChild(hello);
    expect(hello.parentNode).toBe(otherElement);

    element.insertBefore(hello, world);
    expect(hello.parentNode).toBe(element);
    expect(element.children).toStrictEqual([hello, world]);
  });

  it('should append if referenceNode is null', () => {
    const world = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'world!',
    });

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
      children: [
        world,
      ],
    });
    expect(element.children).toStrictEqual([world]);

    const hello = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello',
    });
    element.insertBefore(hello, null);
    expect(element.children).toStrictEqual([world, hello]);
  });

  it('should append if referenceNode is missing', () => {
    const world = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'world!',
    });

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
      children: [
        world,
      ],
    });
    expect(element.children).toStrictEqual([world]);

    const dummy = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'this is dummy',
    });

    const hello = new TextNode({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Text
      nodeValue: 'hello',
    });

    expect(() => {
      element.insertBefore(hello, dummy)
    })
      .toThrowError('Text is not exist in <element>');
  });
  
  it('should return attribute value', () => {
    const attrs: Attributes = {
      attribute: 'value',
    };

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      // Element
      tagName: 'element',
      attributes: attrs,
    });

    expect(element.getAttribute('attribute')).toStrictEqual('value');
  });

  it('should find attribute value', () => {
    const attrs: Attributes = {
      attribute: 'value',
    };

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      //Element
      tagName: 'element',
      attributes: attrs,
    });

    expect(element.hasAttribute('attribute')).toBeTrue();
  });

  it('should set attribute value', () => {
    const attrs: Attributes = {
      attribute: 'value',
    };

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      //Element
      tagName: 'element',
      attributes: attrs,
    });

    element.setAttribute('say', 'hello');

    expect(element.attributes).toStrictEqual({
      attribute: 'value',
      say: 'hello',
    });
  });

  it('should remove attribute value', () => {
    const attrs: Attributes = {
      attribute: 'value',
      say: 'Goodbye',
    };

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      //Element
      tagName: 'element',
      attributes: attrs,
    });

    element.removeAttribute('say');

    expect(element.attributes).toStrictEqual({
      attribute: 'value',
    });
  });

  it('should change attribute value correctly', () => {
    const attrs: Attributes = {
      attribute: 'value',
    };

    const element = new Element({
      // Node
      namespaceURI: 'https://example.com/element/node',
      rootDocument: dummyDocument,
      //Element
      tagName: 'element',
      attributes: attrs,
    });

    expect(element.attributes).toStrictEqual({
      attribute: 'value',
    });

    element.setAttribute('say', 'hello');
    expect(element.attributes).toStrictEqual({
      attribute: 'value',
      say: 'hello',
    });

    element.setAttribute('say', 'goodbye');
    expect(element.attributes).toStrictEqual({
      attribute: 'value',
      say: 'goodbye',
    });

    element.removeAttribute('say');
    expect(element.attributes).toStrictEqual({
      attribute: 'value',
    });
  });
});
