import {Point} from './point';

/**
 *
 * @param {number} b y-intercept
 * @param {number} m slope
 * @param {Point[]} points a list of data points.
 * @param {number} [learningRate=1] optional factor of partial derivative.
 * @return {number[]} The new b (y-intercept) and m (slope) values; [b, m] respectively.
 */
export function stepGradient(b: number, m: number, points: Point[], learningRate: number = 1): number[] {
  let bGradient = 0;
  let mGradient = 0;
  let n = points.length;

  // Calculate the derivative using the power rule ( @see https://en.wikipedia.org/wiki/Power_rule )
  points.forEach((point: Point) => {
    bGradient += -(2 / n) * (point.y - ((m * point.x) + b)); // => partial derivative with respect to b.
    mGradient += -(2 / n) * point.x * (point.y - ((m * point.x) + b)); // => partial derivative with respect to m.
  });
  return [
    b - ( learningRate * bGradient ),
    m - ( learningRate * mGradient )
  ];
}
