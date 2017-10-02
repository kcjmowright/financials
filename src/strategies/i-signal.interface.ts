import {Point} from '../math/point';

export interface ISignal {

  weight: number;

  /**
   *
   * @param {Point[]} dailyQuotes
   * @param {Point[]} dailyLogReturns period returns time series in descending time order.
   * @param {Point[]} monthlyReturns
   * @return {number[]} monthly weighted signal
   */
  calculate: (dailyQuotes: Point[], dailyLogReturns: Point[], monthlyReturns: Point[]) => number[];

}
