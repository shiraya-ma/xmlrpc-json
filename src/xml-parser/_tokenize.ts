'use strict';

import type {
  CloseTagToken,
  ContentToken,
  OpenTagToken,
  Token,
} from './_token-types'

/** @internal */
export function tokenize (xml: string) {
  const tokens: Token[] = [];
  let pos = 0;

  while (pos < xml.length) {
    // close tag or open tag
    if (xml[pos] === '<') {
      // close tag
      if (xml[pos + 1] === '/') {
        const closeIndex = xml.indexOf('>', pos);
        const name = xml.slice(pos + 2, closeIndex).trim();
        const closeToken: CloseTagToken = {
          type: 'close',
          name,
        };
        tokens.push(closeToken);
        pos = closeIndex + 1;
      }
      // open tag
      else {
        const closeIndex = xml.indexOf('>', pos);
        const withClose = xml[closeIndex - 1] === '/';
        
        const closePos = withClose? closeIndex - 1: closeIndex;

        const name = xml.slice(pos + 1, closePos).trim();
        const openToken: OpenTagToken = {
          type: 'open',
          name,
        };
        tokens.push(openToken);

        if (withClose) {
          const closeTag: CloseTagToken = {
            type: 'close',
            name,
          };
          tokens.push(closeTag);
        }

        pos = closeIndex + 1;
      }
    }

    // content
    else {
      const nextTagIndex = xml.indexOf('<', pos);
      const content = xml.slice(pos, nextTagIndex === -1 ? xml.length : nextTagIndex).trim();
      if (content) {
        const contentToken: ContentToken = {
          type: 'content',
          content,
        };
        tokens.push(contentToken);
      }
      pos = nextTagIndex === -1 ? xml.length : nextTagIndex;
    }
  }

  return tokens;
};
