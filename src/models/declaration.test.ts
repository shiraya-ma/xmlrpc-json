'use strict';
import { describe, expect, it } from 'bun:test';

import { DeclarationElement } from './declaration';
import { Document } from './document';
import type { Attributes } from './_attributes';

describe('DeclarationElement', () => {
  it('should initialize DeclarationElement', () => {
    const dummyDocument = {} as Document;
    const attrs: Attributes = {
      attribute: 'value',
    };

    const declaration = new DeclarationElement({
      namespaceURI: 'https://example.com/declaration/node',
      rootDocument: dummyDocument,
      attributes: attrs,
    });

    expect(declaration.nodeType).toStrictEqual('Declaration');
    expect(declaration.namespaceURI).toStrictEqual('https://example.com/declaration/node');
    expect(declaration.rootDocument).toBe(dummyDocument);
    expect(declaration.attributes).toStrictEqual(attrs);
  });
  
  it('should clone DeclarationElement', () => {
    const attrs: Attributes = {
      attribute: 'value',
    };

    const originalDeclaration = new DeclarationElement({
      namespaceURI: 'https://example.com/declaration/node',
      rootDocument: undefined,
      attributes: attrs,
    });

    const clonedDeclaration = originalDeclaration.cloneNode();

    expect(clonedDeclaration).not.toBe(originalDeclaration);
    expect(clonedDeclaration.nodeType).toBe(originalDeclaration.nodeType);
    expect(clonedDeclaration.namespaceURI).toBe(originalDeclaration.namespaceURI);
    expect(clonedDeclaration.rootDocument).toBe(originalDeclaration.rootDocument);
    expect(clonedDeclaration.attributes).toStrictEqual(originalDeclaration.attributes);
  });

  it('should return attribute value', () => {
    const dummyDocument = {} as Document;
    const attrs: Attributes = {
      attribute: 'value',
    };

    const declaration = new DeclarationElement({
      namespaceURI: 'https://example.com/declaration/node',
      rootDocument: dummyDocument,
      attributes: attrs,
    });

    expect(declaration.getAttribute('attribute')).toStrictEqual('value');
  });

  it('should find attribute value', () => {
    const dummyDocument = {} as Document;
    const attrs: Attributes = {
      attribute: 'value',
    };

    const declaration = new DeclarationElement({
      namespaceURI: 'https://example.com/declaration/node',
      rootDocument: dummyDocument,
      attributes: attrs,
    });

    expect(declaration.hasAttribute('attribute')).toBeTrue();
  });

  it('should set attribute value', () => {
    const dummyDocument = {} as Document;
    const attrs: Attributes = {
      attribute: 'value',
    };

    const declaration = new DeclarationElement({
      namespaceURI: 'https://example.com/declaration/node',
      rootDocument: dummyDocument,
      attributes: attrs,
    });

    declaration.setAttribute('say', 'hello');

    expect(declaration.attributes).toStrictEqual({
      attribute: 'value',
      say: 'hello',
    });
  });

  it('should remove attribute value', () => {
    const dummyDocument = {} as Document;
    const attrs: Attributes = {
      attribute: 'value',
      say: 'Goodbye',
    };

    const declaration = new DeclarationElement({
      namespaceURI: 'https://example.com/declaration/node',
      rootDocument: dummyDocument,
      attributes: attrs,
    });

    declaration.removeAttribute('say');

    expect(declaration.attributes).toStrictEqual({
      attribute: 'value',
    });
  });

  it('should change attribute value correctly', () => {
    const dummyDocument = {} as Document;
    const attrs: Attributes = {
      attribute: 'value',
    };

    const declaration = new DeclarationElement({
      namespaceURI: 'https://example.com/declaration/node',
      rootDocument: dummyDocument,
      attributes: attrs,
    });

    expect(declaration.attributes).toStrictEqual({
      attribute: 'value',
    });

    declaration.setAttribute('say', 'hello');
    expect(declaration.attributes).toStrictEqual({
      attribute: 'value',
      say: 'hello',
    });

    declaration.setAttribute('say', 'goodbye');
    expect(declaration.attributes).toStrictEqual({
      attribute: 'value',
      say: 'goodbye',
    });

    declaration.removeAttribute('say');
    expect(declaration.attributes).toStrictEqual({
      attribute: 'value',
    });
  });
});
