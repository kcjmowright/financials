import {Point} from './point';

/**
 * Calculate the error for the given test y-intercept, slope and points.
 *
 * @param {number} b the test y-intercept
 * @param {number} m the test slope.
 * @param {Point[]} points the data set points.
 * @return {number} the error value.
 */
export function gradientDescentError(b: number, m: number, points: Point[]): number {
  return points.reduce((error, point) => error + Math.pow((point.y - (m * point.x + b)), 2),
    0 // <= initial error value
  ) / points.length;
}
