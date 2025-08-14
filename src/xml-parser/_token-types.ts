'use strict';

/** @internal */
export type OpenTagToken = {
  type: 'open';
  name: string;
};

/** @internal */
export type CloseTagToken = {
  type: 'close';
  name: string;
};

/** @internal */
export type ContentToken = {
  type: 'content';
  content: string;
};

/** @internal */
export type Token = OpenTagToken | CloseTagToken | ContentToken;
