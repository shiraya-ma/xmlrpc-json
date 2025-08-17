'use strict';
import { describe, expect, it } from 'bun:test';

import { _getAttribute, _hasAttribute, _removeAttribute, _setAttribute } from './_attributes';

describe('attributes', () => {
  it('should get attribute value', () => {
    const value = _getAttribute({
      attr: 'value',
    }, 'attr');

    expect(value).toStrictEqual('value');
  });

  it('should get attribute empty value', () => {
    const value = _getAttribute({
      empty: '',
    }, 'empty');

    expect(value).toStrictEqual('');
  });

  it('should find attribute value', () => {
    const value = _hasAttribute({
      attr: 'value',
    }, 'attr');

    expect(value).toBeTrue();
  });

  it('should not find attribute value', () => {
    const value = _hasAttribute({
      dummy: 'value',
    }, 'attr');

    expect(value).toBeFalse();
  });

  it('should get null for undefined attribute value', () => {
    const value = _getAttribute({
      attr: 'value',
    }, 'invalid');

    expect(value).toBeNull();
  });

  it('should set attribute value', () => {
    const attr = _setAttribute({
      hoge: 'hogehoge',
      fuga: 'fugafuga',
    }, 'piyo', 'piyopiyo');

    expect(attr).toStrictEqual({
      hoge: 'hogehoge',
      fuga: 'fugafuga',
      piyo: 'piyopiyo',
    });
  });

  it('should override attribute value', () => {
    const attr = _setAttribute({
      attr: 'old value',
    }, 'attr', 'new value');

    expect(attr).toStrictEqual({
      attr: 'new value',
    });
  });

  it('should remove attribute value', () => {
    const attr = _removeAttribute({
      hoge: 'hogehoge',
      fuga: 'fugafuga',
      piyo: 'piyopiyo',
    }, 'fuga');

    expect(attr).toStrictEqual({
      hoge: 'hogehoge',
      piyo: 'piyopiyo',
    });
  });

  it('should not remove not exist attribute value', () => {
    const attr = _removeAttribute({
      hoge: 'hogehoge',
      fuga: 'fugafuga',
      piyo: 'piyopiyo',
    }, 'foobar');

    expect(attr).toStrictEqual({
      hoge: 'hogehoge',
      fuga: 'fugafuga',
      piyo: 'piyopiyo',
    });
  });
});
