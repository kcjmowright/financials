import {stepGradient} from './step-gradient';
import {Point} from './point';

/**
 *
 * @param {Point[]} points list of data points.
 * @param {number} startB starting b ( y-intercept )
 * @param {number} startM starting m ( slope )
 * @param {number} [iterations=1000] number of iterations.
 * @param {number} [learningRate=1] factor of derivative.
 * @return {number[]} y-intercept and slope of the best fitting line.
 */
export function gradientDescent(points: Point[], startB: number, startM: number, iterations: number = 1000, learningRate: number = 1): number[] {
  let b = startB;
  let m = startM;

  for(let i = iterations; --i >= 0; ) {
    [b, m] = stepGradient(b, m, points, learningRate);
  }
  return [b, m];
}
