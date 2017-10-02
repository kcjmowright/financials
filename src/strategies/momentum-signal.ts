import {filterToFirstOfMonth} from './filter-to-first-of-month';
import {ISignal} from './i-signal.interface';
import {Point, average, sum, variance} from '../math';

/**
 * A momentum signal bounded to +/- 3.
 *
 * By default the momentum signal is calculated to the beginning of the month over the last 75 days.
 *
 */
export class MomentumSignal implements ISignal {

  /**
   *
   * @param {number} [momentumPeriod=75] Number of days to calculate daily momentum.
   * @param {number} [monthsLookBack=116] Number of months to look back to calculate
   * @param {number} [weight=0.8] The weight of the signal.
   */
  constructor(public momentumPeriod: number = 75, public monthsLookBack: number = 116, public weight: number = 0.8) {
  }

  /**
   * @param {Point[]} dailyQuotes daily quotes time series.
   * @param {Point[]} dailyReturns natural log + 1 of returns time series.
   * @param {Point[]} monthlyReturns
   * @return {number[]} weighted signal values for the beginning of each month in the given time series.
   */
  public calculate = (dailyQuotes: Point[], dailyReturns: Point[], monthlyReturns: Point[]): number[] => {
    let signalValues = dailyReturns
      .map((p, idx, arr) => {
        // Sum the values for the last period number of days.
        let sums = sum(arr.slice(idx + 1, idx + this.momentumPeriod + 1), v => v.y);
        // Calculate the standard deviation for the last period number of days.
        let std = Math.sqrt(variance(arr.slice(idx + 1, idx + this.momentumPeriod + 1), v => v.y));

        // Calculate the daily momentum.
        // daily momentum = sum of returns over time period / standard deviation
        return new Point(p.x, sums / std);
      })
      // Given the list is sorted by date descending, if this month does not equal next month, then its the first point of the month.
      .filter(filterToFirstOfMonth)
      // Extract just the prices.
      .map( p => p.y)
      // Remove invalid values.
      .filter(s => !isNaN(s))
      // Reduce array to length of `this.monthsLookBack`
      .slice(0, this.monthsLookBack)
      // Calculate the monthly signal values
      .map((v, idx, arr) => {
        // Slice the values from the next index to the end of the list
        let momentums = arr.slice(idx);
        // Calculate momentum z-score and bound the result
        // z-score normalizes the momentum
        // momentum - average(momentums) / std(momentums)
        return (v - average(momentums)) / Math.sqrt(variance(momentums));
      })
      .filter(s => !isNaN(s));

    // => shift signalValues.  Signal is for previous period up to the given date.
    signalValues.shift();

    // => Calculate weighted signal
    return signalValues
      .map( (s, idx) => s * this.weight);
  }
}
