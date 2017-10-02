import {isUndefined} from 'lodash';
import {Point} from '../math';
import moment = require('moment');

/**
 * Given a list is sorted by date descending, if this month does not equal next month, then its the first point of the month.
 * @param {Point} p
 * @param {number} idx
 * @param {Point[]} arr
 * @return {boolean}
 */
export function filterToFirstOfMonth(p: Point, idx: number, arr: Point[]): boolean {
  let next = arr[idx + 1];

  return !isUndefined(next) && moment(p.x).get('month') !== moment(next.x).get('month');
}
