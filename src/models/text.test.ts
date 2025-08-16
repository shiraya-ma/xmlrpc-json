'use strict';
import { describe, expect, it } from 'bun:test';

import { TextNode } from './text';
import type { Document } from './_tmp';

describe('TextNode', () => {
  it('should initialize TextNode', () => {
    const dummyDocument = {} as Document;

    const text = new TextNode({
      namespaceURI: 'https://example.com/text/node',
      rootDocument: dummyDocument,
      nodeValue: 'hello',
    });

    expect(text.nodeType).toStrictEqual('Text');
    expect(text.namespaceURI).toStrictEqual('https://example.com/text/node');
    expect(text.rootDocument).toBe(dummyDocument);
    expect(text.nodeValue).toStrictEqual('hello');
  });

  it('should initialize with blank string', () => {
    const dummyDocument = {} as Document;

    const text = new TextNode({
      namespaceURI: 'https://example.com/text/node',
      rootDocument: dummyDocument,
    });
    expect(text.nodeValue).toStrictEqual('');
  });

  it('should clone Text', () => {
    const originalText = new TextNode({
      namespaceURI: 'https://example.com/text/node',
      rootDocument: undefined,
      nodeValue: 'hello',
    });

    const clonedText = originalText.cloneNode();

    expect(clonedText).not.toBe(originalText);
    expect(clonedText.nodeType).toBe(originalText.nodeType);
    expect(clonedText.namespaceURI).toBe(originalText.namespaceURI);
    expect(clonedText.rootDocument).toBe(originalText.rootDocument);
    expect(clonedText.nodeValue).toBe(originalText.nodeValue);
  });

  it('should override text', () => {
    const dummyDocument = {} as Document;

    const text = new TextNode({
      namespaceURI: 'https://example.com/text/node',
      rootDocument: dummyDocument,
      nodeValue: 'hello',
    });

    expect(text.nodeValue).toStrictEqual('hello');

    text.nodeValue = 'goodbye';
    expect(text.nodeValue).toStrictEqual('goodbye');
  });

  it('should failed to override text with invalid type', () => {
    const dummyDocument = {} as Document;

    const text = new TextNode({
      namespaceURI: 'https://example.com/text/node',
      rootDocument: dummyDocument,
      nodeValue: 'hello',
    });

    expect(() => {
      text.nodeValue = {invalid: 'type'} as unknown as string;
    }).toThrowError('Unexpected value type: object');
  });
});
