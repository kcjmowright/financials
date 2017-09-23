import * as _ from 'lodash';
import {average} from './average';

/**
 * The average of the squared differences from the mean.
 * @param {number | number[] | any[]} values data.
 * @param {(value: any, index: number, array: any[]) => number} [fn] optional callback function to operate on each element in the array.
 * @return {number} the variance.
 */
export function variance(values: number | number[] | any[] = [], fn?:  (value: any, index: number, array: any[]) => number): number {
  if(values === undefined || values === null) {
    return undefined;
  }
  if(!Array.isArray(values)) {
    values = [ values ];
  }
  if(!values.length) {
    return undefined;
  }
  if(typeof values[0] !== 'number' && !fn) {
    return undefined;
  }
  let avg = average(values, fn);

  return average(_.map(values, (v, idx, arr) => Math.pow((!!fn ? fn(v, idx, <any[]>arr) : v ) - avg, 2)));
}
