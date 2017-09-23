import {average, Point} from '../math';

/**
 * Calculate exponential moving average value of the point.y values.
 *
 * @param {Point[]} values
 * @param {number} period
 * @return {Point[]}
 */
export function exponentialMovingAverage(values: Point[], period: number = 20): Point[] {
  if(!values || values.length < period) {
    throw new Error('Not enough data.');
  }
  const results: Point[] = [];
  const lambda =  2 / ( 1 + period );
  let startIdx = 0;
  let endIdx = period;
  let ema;
  let previousEMA = average(values.slice(startIdx, endIdx), p => p.y); // <= Initialize with SMA
  let avg;

  while(endIdx <= values.length) {
    avg = average(values.slice(startIdx, endIdx), p => p.y);
    ema = ( avg * lambda ) + ( previousEMA * (1 - lambda));
    results.push(new Point(values[endIdx - 1].x, ema));
    startIdx++;
    endIdx++;
    previousEMA = ema;
  }
  return results;
}
