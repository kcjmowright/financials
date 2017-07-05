import * as _ from 'lodash';
import {average} from './average';

/**
 *
 * @param values
 * @return {number}
 */
export function variance(values: number[] = []): number {
  let avg = average(values);

  return average(_.map(values, v => Math.pow(v - avg, 2)));
}
