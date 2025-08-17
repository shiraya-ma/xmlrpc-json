'use strict';

export type Attributes = Record<string, string>;

export function _getAttribute (attrs: Attributes, name: string): string | null {
  return attrs[name] ?? null;
};

export function _hasAttribute (attr: Attributes, name: string): boolean {
  return name in attr;
};

export function _removeAttribute (attrs: Attributes, name: string): Attributes {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { [name]: _, ...attributes } = attrs;
  return attributes;
};

export function _setAttribute (attrs: Attributes, name: string, value: string): Attributes {
  const attributes: Attributes = {
    ...attrs,
    [name]: value,
  };

  return attributes;
};
