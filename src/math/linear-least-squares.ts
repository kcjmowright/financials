import * as _ from 'lodash';

import {Point} from './point';
import {Line} from './line';

/**
 * Linear Regression
 *
 * @see http://mathworld.wolfram.com/LeastSquaresFitting.html
 * @param {number[]|Point[]} valuesX
 * @param {number[]} [valuesY] required if `valuesX` is an array of numbers.
 * @return {ILinearLeastSquares}
 */
export function linearLeastSquares(valuesX: number[] | Point[], valuesY?: number[]): ILinearLeastSquares {
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
  const count = valuesX.length;
  const x0 = Math.min.apply(null, valuesX);
  const xL = Math.max.apply(null, valuesX);

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for(let idx = count; --idx >= 0; ) {
    let x = <number>valuesX[idx];
    let y = valuesY[idx];

    sumX += x;
    sumXX += Math.pow(x, 2);
    sumXY += x * y;
    sumY += y;
    sumYY += Math.pow(y, 2);
  }

  const avgX = sumX / count;
  const avgY = sumY / count;
  const xx = count * sumXX - Math.pow(sumX, 2);
  const yy = count * sumYY - Math.pow(sumY, 2);
  const xy = count * sumXY - sumX * sumY;
  const slope = xy / xx;
  const yIntercept = avgY - slope * avgX;
  const correlationR = xy / Math.sqrt(xx * yy);
  const coefficientsOfDeterminationR2 = Math.pow(correlationR, 2);
  let sst = 0;

  for(let idx = count; --idx >= 0; ) {
    sst += Math.pow((valuesY[idx] - avgY), 2);
  }
  const sse = sst - coefficientsOfDeterminationR2 * sst;
  const stdErrorOfEstimate = Math.sqrt(sse / (count - 2));
  const ssr = sst - sse;
  const pointA = new Point(x0, (slope * x0 + yIntercept));
  const pointB = new Point(xL, (slope * xL + yIntercept));
  const line = new Line(pointA, pointB);

  return {
    coefficientsOfDeterminationR2,
    correlationR,
    line,
    sse,
    ssr,
    sst,
    stdErrorOfEstimate,
    sumX,
    sumY
  };
}

export interface ILinearLeastSquares {
  coefficientsOfDeterminationR2: number;
  correlationR: number;
  line: Line;
  sse: number;
  ssr: number;
  sst: number;
  stdErrorOfEstimate: number;
  sumX: number;
  sumY: number;
}
