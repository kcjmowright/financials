import * as _ from 'lodash';

import {average, Point} from '../math';

/**
 * https://www.tradingtechnologies.com/help/x-study/technical-indicator-definitions/welles-wilders-smoothing-average-wws/
 *
 * Calculate a simple moving average (SMA).
 * Add the previous day’s Wilder Smoothing Value to difference between
 * the close and the previous day’s smoothing value divided by the period.
 *
 * Smoothing today = smoothing previous + (today’s close – previous day’s smoothing value) / period
 *
 * @param {number[] | Point[]} valuesX list of date data as a number list, or list of Point data.
 * @param {number[]} valuesY price data.  Optional if valuesX is a list of Point data.
 * @param {number} period
 * @return {Point[]}
 */
function wellesWilderSmoothing(valuesX: number[] | Point[], valuesY?: number[], period: number = 14): Point[] {
  if(!valuesX || !valuesX.length || valuesX.length < period) {
    throw new Error('Not enough data.');
  }
  if(valuesX[0] instanceof Point) {
    valuesY = _.map(<Point[]>valuesX, v => v.y);
    valuesX = _.map(<Point[]>valuesX, v => v.x);
  }
  if(valuesX.length !== valuesY.length) {
    throw new Error('valuesX and valuesY data points are unequal in length.');
  }

  let result: Point[] = [];
  let startIdx = 0;
  let endIdx = period;
  // let lambda =  2 / ( 1 + period );
  let lambda = 1 / period;
  let value;
  let previousValue = average(valuesY.slice(startIdx, endIdx)); // <= Initialize with SMA
  let avg;

  while(endIdx <= valuesY.length) {
    avg = average(valuesY.slice(startIdx, endIdx));
    value = ( avg * lambda ) + (valuesY[endIdx] - previousValue) / period;
    // ema = ( avg * lambda ) + ( previousEMA * (1 - lambda));
    result.push(new Point(<number>valuesX[endIdx - 1], value));
    startIdx++;
    endIdx++;
    previousValue = value;
  }
  return result;
}
