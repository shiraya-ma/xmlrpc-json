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
        const endIndex = xml.indexOf('>', pos);
        const isSelfClosing = xml[endIndex - 1] === '/';

        const tagContentEnd = isSelfClosing ? endIndex - 1 : endIndex;
        const rawTagContent = xml.slice(pos + 1, tagContentEnd);

        const firstSpaceIndex = rawTagContent.search(/\s/);

        const name = firstSpaceIndex === -1 ? rawTagContent : rawTagContent.slice(0, firstSpaceIndex);
        const attributesString = firstSpaceIndex === -1 ? '' : rawTagContent.slice(firstSpaceIndex);

        const attributes: Record<string, string> = {};

        const attrRegex = /([a-zA-Z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
        let match: RegExpExecArray | null = null;
        while ((match = attrRegex.exec(attributesString)) !== null) {
          type MatchPattern = [string, string, string, string];
          const [, key, value1, value2 ] = match as unknown as MatchPattern;
          attributes[key] = value1 ?? value2;
        }

        const openToken: OpenTagToken = {
          type: 'open',
          name,
          attributes,
        };
        tokens.push(openToken);

        if (isSelfClosing) {
          tokens.push({ type: 'close', name });
        }
        pos = endIndex + 1;
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
