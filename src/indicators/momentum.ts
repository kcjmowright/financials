import {Point, sum, variance} from '../math';

/**
 *
 * @param {Point[] | number[]} values
 * @return {number}
 */
export function momentum(values: Point[] | number[]): number {
  if(typeof values[0] !== 'number') {
    values = (<Point[]>values).map(v => v.y);
  }
  return sum(values) / Math.sqrt(variance(values));
}
