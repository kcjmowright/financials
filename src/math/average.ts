import {sum} from './sum';

/**
 *
 * @param {number | number[] } values
 * @return {number}
 */
export function average(values: number | number[]): number {
  if(!Array.isArray(values)) {
    if(typeof values !== 'number') {
      return undefined;
    }
    values = [ values ];
  }
  if(!values.length) {
    return undefined;
  }
  return sum(values) / values.length;
}
