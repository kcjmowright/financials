import {average, variance} from '../math';

/**
 * Calculate a Sharpe Ratio, a risk adjusted return measure, for a given series.
 *
 * Used to test how well a trading strategy performs.  Look for values above 1 or 2.
 *
 * Sharpe Ratio = average return / standard deviation
 *
 * @param {number[]} returns return percentages expressed as decimal values.
 * @param {number} [factor=1] factor used to scale series. Default is 1.
 *                            For example: daily to annualized: use 252, daily to weekly: use 52, daily to monthly: use 12.
 * @param {number} [riskFreeRate=0] the risk free rate of return.  Defaults to 0.
 * @return {number} the sharpe ratio
 */
export function sharpeRatio(returns: number[], factor: number = 1, riskFreeRate: number = 0): number {
  if(returns === undefined || returns === null || !returns.length) {
    return undefined;
  }
  let avg = average(returns);
  let std = Math.sqrt(variance(returns));

  return ((factor * avg) - (Math.sqrt(factor) * riskFreeRate)) / std;
}
