'use strict';
import type {} from 'node';

declare global {
  export type Brand<T, BrandType> = T & {readonly __brand: BrandType };
}
