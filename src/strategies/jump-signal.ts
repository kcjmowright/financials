import {ISignal} from './i-signal.interface';
import {Point, average, variance} from '../math';

/**
 * Jump Signal
 * -1 * ((short average - long average) / standard deviation of the long).
 *
 * By default the short period is 2 months and the long period is 2 years (24 months).
 */
export class JumpSignal implements ISignal {

  /**
   * @param {number} [shortPeriod=2] 2 months.
   * @param {number} [longPeriod=24] 24 months (2 years).
   * @param {number} [weight=0.2] The weighting factor of this signal.
   * @constructor
   */
  constructor(public shortPeriod: number = 2, public longPeriod = 24, public weight: number = 0.2) {
  }

  /**
   * @param {Point[]} quotes
   * @param {Point[]} dailyLogReturns
   * @param {Point[]} monthlyReturns
   * @return {number[]} weighted signal values time series.
   */
  public calculate = (quotes: Point[], dailyLogReturns: Point[], monthlyReturns: Point[]): number[] => {
    return monthlyReturns.map((r, idx, arr) => {
      let shortSlice = arr.slice(idx + 1, idx + this.shortPeriod + 1);
      let longSlice = arr.slice(idx + 1, idx + this.longPeriod + 1);
      let signal = ((average(shortSlice, p => p.y) - average(longSlice, p => p.y)) / Math.sqrt(variance(longSlice, p => p.y)));

      return this.weight * -signal;
    })
    // Filter out invalid values.
    .filter(v => !isNaN(v));
  }
}
