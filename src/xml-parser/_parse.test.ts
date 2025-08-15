'use strict';
import { describe, expect, it } from 'bun:test';

import type { Token } from './_token-types';
import { parse } from './_parse';

describe('parse', () => {

  it('should parse single element with text content', () => {
    const tokens: Token[] = [
      { type: 'open', name: 'greet', attributes: {} },
      { type: 'content', content: 'hello' },
      { type: 'close', name: 'greet' }
    ];
    const nodes = parse(tokens);
    expect(nodes).toStrictEqual([
      {
        name: 'greet',
        attributes: {},
        children: [
          'hello',
        ],
      },
    ]);
  });
  
  it('should parse nested elements', () => {
    const tokens: Token[] = [
      { type: 'open', name: 'parent', attributes: {} },
      { type: 'open', name: 'child', attributes: {} },
      { type: 'content', content: 'text' },
      { type: 'close', name: 'child' },
      { type: 'close', name: 'parent' }
    ];
    const nodes = parse(tokens);
    expect(nodes).toStrictEqual([
      {
        name: 'parent',
        attributes: {},
        children: [
          {
            name: 'child',
            attributes: {},
            children: [
              'text',
            ],
          },
        ],
      },
    ]);
  });
  
  it('should parse multiple sibling elements', () => {
    const tokens: Token[] = [
      { type: 'open', name: 'root', attributes: {} },
      { type: 'open', name: 'a', attributes: {} },
      { type: 'close', name: 'a' },
      { type: 'open', name: 'b', attributes: {} },
      { type: 'close', name: 'b' },
      { type: 'close', name: 'root' }
    ];
    const nodes = parse(tokens);
    expect(nodes).toStrictEqual([
      {
        name: 'root',
        attributes: {},
        children: [
          {
            name: 'a',
            attributes: {},
            children: [],
          },
          {
            name: 'b',
            attributes: {},
            children: [],
          },
        ],
      },
    ]);
  });

  it('should parse with single attribute', () => {
    const tokens: Token[] = [
      { type: 'open', name: 'greet', attributes: { attribute: 'value' } },
      { type: 'content', content: 'hello' },
      { type: 'close', name: 'greet' }
    ];
    const nodes = parse(tokens);
    expect(nodes).toStrictEqual([
      {
        name: 'greet',
        attributes: {
          attribute: 'value',
        },
        children: [
          'hello',
        ],
      },
    ]);
  });

  it('should parse with multiple attributes', () => {
    const tokens: Token[] = [
      { type: 'open', name: 'greet', attributes: { hoge: 'hogehoge', fuga: 'fugafuga' } },
      { type: 'content', content: 'hello' },
      { type: 'close', name: 'greet' }
    ];
    const nodes = parse(tokens);
    expect(nodes).toStrictEqual([
      {
        name: 'greet',
        attributes: {
          hoge: 'hogehoge',
          fuga: 'fugafuga',
        },
        children: [
          'hello',
        ],
      },
    ]);
  });
  
  it('should handle content outside root element (invalid)', () => {
    const tokens: Token[] = [
      { type: 'content', content: 'text outside root' }
    ];
    expect(() => parse(tokens)).toThrow('Content "text outside root" found outside of a root element');
  });
  
  it('should handle mismatched closing tag (invalid)', () => {
    const tokens: Token[] = [
      { type: 'open', name: 'a', attributes: {} },
      { type: 'close', name: 'b' }
    ];
    expect(() => parse(tokens)).toThrowError('Mismatched closing tag: </a> but got </b>');
  });
  
  it('should handle unclosed tag (invalid)', () => {
    const tokens: Token[] = [
      { type: 'open', name: 'root', attributes: {} }
    ];
    expect(() => parse(tokens)).toThrowError('Unclosed tag: <root>');
  });
  
  it('should handle multiple root elements (invalid)', () => {
    const tokens: Token[] = [
      { type: 'open', name: 'a', attributes: {} },
      { type: 'close', name: 'a' },
      { type: 'open', name: 'b', attributes: {} },
      { type: 'close', name: 'b' }
    ];
    expect(() => parse(tokens)).toThrowError('Multiple root elements are not allowed');
  });
});
