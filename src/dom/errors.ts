'use strict';

export class DOMException extends Error {
  public static readonly HIERARCHY_REQUEST_ERROR = 'HierarchyRequestError' as DOMExceptionName;

  constructor (name: DOMExceptionName, message: string) {
    super(`${name}: ${message}`);
  };
};

export type DOMExceptionName = Brand<string, 'DOMExceptionName'>;
