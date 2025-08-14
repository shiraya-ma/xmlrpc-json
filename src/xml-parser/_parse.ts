'use strict';

import type { Token } from './_token-types';
import type { XMLNode } from './_xml-node-types';

/** @internal */
export function parse (tokens: Token[]): XMLNode[] {
  const rootNodes: XMLNode[] = [];
  const stack: XMLNode[] = [];

  tokens.forEach((token) => {
    if (token.type === 'open') {
      const node: XMLNode = {
        name: token.name,
        attributes: token.attributes,
        children: [],
      };
      stack.push(node);
    }
    else if (token.type === 'close') {
      if (stack.length === 0) throw new Error(`Unexpected close tag: </${token.name}>`);

      const node = stack.pop()!;
      if (node.name !== token.name) throw new Error(`Mismatched closing tag: </${node.name}> but got </${token.name}>`);

      if (stack.length > 0) {
        stack[stack.length - 1]!.children.push(node);
      }
      else if (rootNodes.length > 0) {
        throw new Error('Multiple root elements are not allowed');
      }
      else {
        rootNodes.push(node);
      }
    }
    else if (token.type === 'content') {
      if (stack.length === 0) throw new Error(`Content "${token.content}" found outside of a root element`);

      stack[stack.length - 1]!.children = stack[stack.length - 1]!.children.concat(token.content);
    }
  });

  if (stack.length > 0) throw new Error(`Unclosed tag: <${stack[stack.length - 1]!.name}>`);

  return rootNodes;
};
