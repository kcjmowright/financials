import {filterToFirstOfMonth} from './filter-to-first-of-month';
import {ISignal} from './i-signal.interface';
import {Point} from '../math';
import {Quote} from '../company';
import {sharpeRatio} from '../indicators';

export class StrategyRunner {

  public combinedReturns: number[];
  public combinedSignals: number[];
  public dailyReturns: Point[];
  public dailyLogReturns: Point[];
  public monthlyReturns: Point[];
  public signalsResults: Array<number[]>;
  public sharpeRatio: number;

  /**
   * Monthly strategy runner.
   * Assumes quotes are daily values in descending time order.
   * By default gives an annualized sharpe ratio result.
   *
   * @param {Quote[]} quotes daily price data in descending time order.
   * @param {ISignal[]} signals list of ISignal implementations.
   * @param {number} [scaleFactor=12] Monthly values are scaled by default (12) to give an annualized sharpe ratio.
   */
  constructor(public quotes: Quote[], public signals: ISignal[], public scaleFactor: number = 12) {
    // Ensure time series is in descending order.
    quotes.sort( (a, b) => a.x === b.x ? 0 : a.x < b.x ? 1 : -1);

    // todays price / yesterdays price - 1
    this.dailyReturns = this.quotes
      .map((q, idx, arr) => new Point(q.x, q.y / (arr[idx + 1] || { y: undefined }).y - 1))
      .filter(q => !isNaN(q.y));

    // log of the returns
    this.dailyLogReturns = this.dailyReturns
      .map(r => new Point(r.x, Math.log(1 + r.y)));

    // pull the first quote for each month and calculate the monthly returns.
    this.monthlyReturns = this.quotes
      // Given the list is sorted by date descending, if this month does not equal next month, then its the first quote of the month.
      .filter(filterToFirstOfMonth)
      // this months price / last months price - 1
      .map((q, idx, arr) => new Point(q.x, q.y / (arr[idx + 1] || { y: undefined }).y - 1))
      .filter( q => !isNaN(q.y));

    // Iterate through each signal and calculate the monthly signals.
    this.signalsResults = this.signals
      .map((signal, idx, arr) => signal.calculate(this.quotes, this.dailyLogReturns, this.monthlyReturns));

    // sum each months signals and filter out invalid values.
    this.combinedSignals = this.signalsResults[0]
      .map((sr0, idx, arr) => this.signalsResults.reduce((prev, curr) => prev + curr[idx], 0))
      .filter( v => !isNaN(v));

    // multiply by the monthly returns
    this.combinedReturns = this.combinedSignals
      .map((v, idx, arr) => v * this.monthlyReturns[idx].y);

    // calculate the sharpe ratio
    this.sharpeRatio = sharpeRatio(this.combinedReturns, this.scaleFactor);
  }
}
