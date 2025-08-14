'use strict';
import { describe, expect, it } from 'bun:test';

import { tokenize } from './_tokenize';

describe('tokenize', () => {
  it('should tokenize an empty element', () => {
    const tokens = tokenize('');
    expect(tokens).toStrictEqual([]);
  });

  it('should tokenize without contents', () => {
    const tokens = tokenize('<tag></tag>');
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: {} },
      { type: 'close', name: 'tag' },
    ]);
  });

  it('should tokenize an element with only whitespace', () => {
    const tokens = tokenize('<tag>  </tag>');
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: {} },
      { type: 'close', name: 'tag' },
    ]);
  });

  it('should tokenize a single element with text', () => {
    const tokens = tokenize('<greet>hello world!</greet>');
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'greet', attributes: {} },
      { type: 'content', content: 'hello world!' },
      { type: 'close', name: 'greet' },
    ]);
  });

  it('should tokenize multiple text node', () => {
    const xml = '<say>hello<bold>world</bold>!</say>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'say', attributes: {} },
      { type: 'content', content: 'hello' },
      { type: 'open', name: 'bold', attributes: {} },
      { type: 'content', content: 'world' },
      { type: 'close', name: 'bold' },
      { type: 'content', content: '!' },
      { type: 'close', name: 'say' },
    ]);
  });

  it('should tokenize nested tags', () => {
    const tokens = tokenize('<data><hoge>hogehoge</hoge><fuga>fugafuga</fuga><piyo>piyopiyo</piyo></data>');
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'data', attributes: {} },
      { type: 'open', name: 'hoge', attributes: {} },
      { type: 'content', content: 'hogehoge' },
      { type: 'close', name: 'hoge' },
      { type: 'open', name: 'fuga', attributes: {} },
      { type: 'content', content: 'fugafuga' },
      { type: 'close', name: 'fuga' },
      { type: 'open', name: 'piyo', attributes: {} },
      { type: 'content', content: 'piyopiyo' },
      { type: 'close', name: 'piyo' },
      { type: 'close', name: 'data' },
    ]);
  });

  it('should tokenize deeply nested tags', () => {
    const xml = '<a><b><c>deep</c></b></a>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'a', attributes: {} },
      { type: 'open', name: 'b', attributes: {} },
      { type: 'open', name: 'c', attributes: {} },
      { type: 'content', content: 'deep' },
      { type: 'close', name: 'c' },
      { type: 'close', name: 'b' },
      { type: 'close', name: 'a' },
    ]);
  });

  it('should tokenize multiple root-level elements', () => {
    const xml = '<one>1</one><two>2</two>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: "open", name: "one", attributes: {} },
      { type: "content", content: "1" },
      { type: "close", name: "one" },
      { type: "open", name: "two", attributes: {} },
      { type: "content", content: "2" },
      { type: "close", name: "two" },
    ]);
  });

  it('should tokenize a self-closing tag', () => {
    const tokens = tokenize('<br/>');
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'br', attributes: {} },
      { type: 'close', name: 'br' },
    ]);
  });

  it('should tokenize a self-closing tag surrounded by text', () => {
    const xml = 'hello<tag/>world';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      {type: 'content', content: 'hello' },
      {type: 'open', name: 'tag', attributes: {} },
      {type: 'close', name: 'tag' },
      {type: 'content', content: 'world' },
    ]);
  });

  it('should tokenize self-closing tag with space before slash', () => {
    const xml = '<tag />';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: {} },
      { type: 'close', name: 'tag' },
    ]);
  });

  it('should tokenize tag names containing numbers or hyphens', () => {
    const xml = '<item-1>ok</item-1>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'item-1', attributes: {} },
      { type: 'content', content: 'ok' },
      { type: 'close', name: 'item-1' },
    ]);
  });

  it('should tokenize tag names with mixed uppercase and lowercase letters', () => {
    const xml = '<Tag>ok</Tag>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'Tag', attributes: {} },
      { type: 'content', content: 'ok' },
      { type: 'close', name: 'Tag' },
    ]);
  });

  it('should handle spaces right after opening tag name and before closing tag name', () => {
    const xml = '<tag> text </tag>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: {} },
      { type: 'content', content: 'text' },
      { type: 'close', name: 'tag' },
    ]);
  });

  it('should handle newline and tabs between tag and content', () => {
    const xml = [
      '<tag>',
      '\ttext',
      '</tag>',
    ].join('\n');
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: {} },
      { type: 'content', content: 'text' },
      { type: 'close', name: 'tag' },
    ]);
  });

  it('should tokenize with newlines', () => {
    const xml = [
      '<message>',
      '  hello  ',
      '</message>',
    ].join('\n');
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'message', attributes: {} },
      { type: 'content', content: 'hello' },
      { type: 'close', name: 'message' },
    ]);
  });

  it('should handle unexpected characters in the middle of a tag', () => {
    const xml = '<tag >text</tag >';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: {} },
      { type: 'content', content: 'text' },
      { type: 'close', name: 'tag' },
    ]);
  });

  it('should handle missing closing tag gracefully', () => {
    const xml = '<tag>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: {} },
    ]);
  });

  it('should tokenize a tag with a single attribute', () => {
    const xml = '<tag attribute="value"></tag>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: { attribute: 'value' } },
      { type: 'close', name: 'tag' },
    ]);
  });

  it('should tokenize a tag with multiple attributes', () => {
    const xml = '<tag attr1="val1" attr2="val2"></tag>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: { attr1: 'val1', attr2: 'val2' } },
      { type: 'close', name: 'tag' },
    ]);
  });

  it('should tokenize a self-closing tag with attributes', () => {
    const xml = '<img src="image.png" alt="An image"/>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'img', attributes: { src: 'image.png', alt: 'An image' } },
      { type: 'close', name: 'img' },
    ]);
  });

  it('should handle various spaces around attributes', () => {
    const xml = '<tag  attr1 = "val1"   attr2="val2" ></tag>';
    const tokens = tokenize(xml);
    expect(tokens).toStrictEqual([
      { type: 'open', name: 'tag', attributes: { attr1: 'val1', attr2: 'val2' } },
      { type: 'close', name: 'tag' },
    ]);
  });
});
