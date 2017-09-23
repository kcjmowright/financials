import {sum} from './sum';

/**
 *
 * @param {number | number[] | any[]} values. a number, array of numbers
 * @param {Function} [fn] optional callback function to operate on each element in the array.
 * @return {number} the average value or undefined if given invalid values.
 */
export function average(values: number | number[] | any[], fn?:  (value: any, index: number, array: any[]) => number): number {
  if(values === undefined || values === null) {
    return undefined;
  }
  if(!Array.isArray(values)) {
    values = [ values ];
  }
  if(!values.length) {
    return undefined;
  }
  return sum(values, fn) / values.length;
}
