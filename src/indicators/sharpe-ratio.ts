import {average, Point, variance} from '../math';

/**
 * Calculate a Sharpe Ratio for a given series.
 *
 * Sharpe Ratio = average price / standard deviation
 *
 * @param {Point[] | number[]} values series of numbers or Point values where y is the attribute used to calculate the Sharpe ratio.
 * @param {number} [factor=1] factor used to scale series. Default is 1.
 *                            For example: daily to annualized: use 252, daily to weekly: use 52, daily to monthly: use 12.
 * @param {number} [riskFreeRate=0] the risk free rate of return.  Defaults to 0.
 * @return {number} the sharpe ratio
 */
export function sharpeRatio(values: Point[] | number[], factor: number = 1, riskFreeRate: number = 0): number {
  if(values === undefined || values === null || !values.length) {
    return undefined;
  }
  let returns: number[];

  // @todo Do we drop the first computed value since there is no previous value?
  if(typeof values[0] === 'number') {
    returns = (<number[]>values).map((v, idx, arr) => !idx ? 1 : v / arr[idx - 1] - 1);
  } else {
    returns = (<Point[]>values).map((v, idx, arr) => !idx ? 1 : v.y / arr[idx - 1].y - 1);
  }
  let avg = average(returns);
  let std = Math.sqrt(variance(returns));

  return ((factor * avg) - (Math.sqrt(factor) * riskFreeRate)) / std;
}
