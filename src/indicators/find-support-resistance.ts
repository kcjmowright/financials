import * as _ from 'lodash';

import {exponentialMovingAverage} from './exponential-moving-average';
import {Line} from '../math';
import {Point} from '../math';
import {Quote} from '../company';

const BOUNDARY_TOLERANCE = 0.1;

/**
 * @see http://www.investopedia.com/articles/trading/06/pbvchart.asp
 * @see https://www.mql5.com/en/forum/140136
 * @see https://www.mathsisfun.com/calculus/maxima-minima.html
 * @see https://www.mathsisfun.com/calculus/derivatives-rules.html
 * @see https://en.wikipedia.org/wiki/Smoothing
 * @param quotes
 * @param lookBack
 * @param smoothing
 * @param {number} tolerance percentage
 * @return {{trends: Line[], turningPoints: Point[]}}
 */
export function findSupportAndResistance(quotes: Quote[], lookBack: number = 4, smoothing: number = 20, tolerance: number = 0.03) {
  // function smooth(f: Function, x: number): number {
  //   let h2 = smoothing * 2;
  //
  //   return (f(x - h2) - 8 * f(x + smoothing) + 8 * f(x - smoothing) - f(x + h2)) / (12 * smoothing);
  // }
  if(!quotes || quotes.length < Math.max(7, lookBack)) {
    throw new Error('Insufficient number of quotes');
  }
  let smoothed: Point[] = [];
  let minima = [];
  let maxima = [];

  // => smooth prices.
  // for(let i = 4; i < inputs.length; i++) {
  //   smoothed.push(new Point(i - 2, (inputs[i - 4] - 8 * inputs[i - 1] + 8 * inputs[i - 3] - inputs[i]) / 12));
  // }
  let smooothed = exponentialMovingAverage(quotes, smoothing);

  // => find minima and maxima.
  for(let i = lookBack; i < smoothed.length; i++) {
    let edge1 = smoothed[i - lookBack];
    let edge2 = smoothed[i];
    let center = smoothed[i - (lookBack / 2)];
    let delta1 = ( edge1.y / center.y ) - 1;
    let delta2 = ( edge2.y / center.y ) - 1;

    if(delta1 < -tolerance && delta2 < -tolerance) {
      minima.push(center);
    } else if(delta1 > tolerance && delta2 > tolerance) {
      maxima.push(center);
    }
  }

  return {
    trends: {
      resistance: findTrends(maxima, quotes),
      support: findTrends(minima, quotes)
    },
    turningPoints: {
      resistance: findClusters(maxima, quotes),
      support: findClusters(minima, quotes)
    }
  };
}

/**
 *
 * @param {Point[]} values
 * @param {Quote[]} quotes
 * @return {Quote[]}
 */
function findClusters(turningPoints: Point[], quotes: Quote[]): Array<Quote[]> {
  let clusters = [];
  let values = _.clone(turningPoints);

  while(values.length) {
    let base = values.shift();
    let cluster = _.remove(values, m => Math.abs(base.y - m.y) < BOUNDARY_TOLERANCE);

    if(cluster.length) {
      let c = _.map(cluster, p => quotes[p.x]);

      c.push(quotes[base.x]);
      clusters.push(c);
    }
  }
  return clusters;
}

function findTrends(turningPoints: Point[], quotes: Quote[]): Line[] {
  let lines: Line[] = [];

  return lines;
}
