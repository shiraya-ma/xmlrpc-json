'use strict';

/** @internal */
export type XMLNode = {
  name: string;
  attributes: Record<string, string>;
  children: ReadonlyArray<XMLNode | string>;
};
