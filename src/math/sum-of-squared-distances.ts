import {Point} from './point';

/**
 * Sum of squared distances formula.
 * Calculate the sum of the squared deltas between the points y values and the given y-intercept and slope.
 *
 * @param {number} b the test y-intercept
 * @param {number} m the test slope.
 * @param {Point[]} points the data set points.
 * @return {number} the sum of the squared distances value.
 */
export function sumOfSquaredDistances(b: number, m: number, points: Point[]): number {
  return points.reduce(
    (val, point) => val + Math.pow((point.y - (m * point.x + b)), 2),
    0 // <= initial value
  ) / points.length;
}
