import {average} from '../math';
import {Point} from '../math';

export function simpleMovingAverage(values: Point[], period: number = 20): Point[] {
  if(!values || values.length < period) {
    throw new Error('Not enough data.');
  }
  let points: Point[] = [];
  let startIdx = 0;
  let endIdx = period;

  while(endIdx <= values.length) {
    points.push(new Point(values[endIdx - 1].x, average(values.slice(startIdx, endIdx), v => v.y)));
    startIdx++;
    endIdx++;
  }
  return points;
}
