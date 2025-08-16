'use strict';

export type Attributes = Record<string, string>;

export function _getAttribute (attrs: Attributes, name: string): string | null {
  return attrs[name] ?? null;
};

export function _hasAttribute (attr: Attributes, name: string): boolean {
  return name in attr;
};

export function _removeAttribute (attrs: Attributes, name: string): Attributes {
  const attributes: Attributes = {};
  Object.keys(attrs).forEach(key => {
    if (key !== name) {
      attributes[key] = attrs[key]!;
    }
  });
  
  return attributes;
};

export function _setAttribute (attrs: Attributes, name: string, value: string): Attributes {
  const attributes: Attributes = {
    ...attrs,
    [name]: value,
  };

  return attributes;
};
