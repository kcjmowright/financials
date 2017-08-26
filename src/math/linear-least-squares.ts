import * as _ from 'lodash';

import {Point} from './point';
import {Line} from './line';

/**
 *
 * @param {number[]|Point[]} valuesX
 * @param {number[]} [valuesY] required if `valuesX` is an array of numbers.
 * @return {Line}
 */
export function linearLeastSquares(valuesX: number[] | Point[], valuesY?: number[]): Line {
  if(!valuesX || !Array.isArray(valuesX)) {
    throw new Error('Invalid arguments');
  }
  if(valuesX.length === 0) {
    return undefined;
  }
  if(arguments.length !== 2 ) {
    if(!(valuesX[0] instanceof Point)) {
      throw new Error('Invalid arguments');
    }
    valuesY = _.map(<Point[]>valuesX, v => v.y);
    valuesX = _.map(<Point[]>valuesX, v => v.x);
  }
  if(valuesX.length !== valuesY.length) {
    throw new Error('Invalid arguments');
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let count = valuesX.length;
  let x0 = Math.min.apply(null, valuesX);
  let xL = Math.max.apply(null, valuesX);

  for(let idx = count; --idx >= 0; ) {
    let x = <number>valuesX[idx];
    let y = valuesY[idx];

    sumX += x;
    sumY += y;
    sumXX += Math.pow(x, 2);
    sumXY += x * y;
  }

  let slope = (count * sumXY - sumX * sumY) / (count * sumXX - Math.pow(sumX, 2));
  let yIntercept = (sumY / count) - (slope * sumX) / count;
  let pointA = new Point(x0, (slope * x0 + yIntercept));
  let pointB = new Point(xL, (slope * xL + yIntercept));
  let line = new Line(pointA, pointB);

  return line;
}
