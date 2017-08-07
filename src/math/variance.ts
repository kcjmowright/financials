import * as _ from 'lodash';
import {average} from './average';

/**
 * The average of the squared differences from the mean.
 * @param {number[]} values data.
 * @return {number} the variance.
 */
export function variance(values: number[] = []): number {
  let avg = average(values);

  return average(_.map(values, v => Math.pow(v - avg, 2)));
}
