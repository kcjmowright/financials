import * as _ from 'lodash';

import {average, Line} from '../math';
import {FailureSwing} from './failure-swing';

/**
 *
 */
export class RelativeStrengthIndex {
  public values: { date: Date, rsi: number, price: number}[] = [];
  public overboughtThreshold = 70;
  public oversoldThreshold = 30;

  /**
   * @param {number[]} prices
   * @param {date[]} [dates=[]]
   * @param {number} [period=14] The default look-back period for RSI is 14, but this can be lowered to increase sensitivity
   * or raised to decrease sensitivity.
   */
  constructor(public prices: number[], public dates: Date[] = [], public period: number = 14) {
    this.calculate();
  }

  /**
   *
   */
  private calculate(): void {
    let gains = [];
    let losses = [];
    let periodPrices = _.slice(this.prices, 0, this.period + 1);
    let afterPeriodPrices = _.slice(this.prices, this.period + 1);
    let afterPeriodDates = _.slice(this.dates, this.period);

    _.each(periodPrices, (v, idx) => {
      if(!!idx) {
        let diff = v - periodPrices[idx - 1];

        if(diff > 0) {
          gains.push(diff);
          losses.push(0);
        } else {
          gains.push(0);
          losses.push(Math.abs(diff));
        }
      }
    });
    let avgGains = average(gains);
    let avgLosses = average(losses);
    let prevGains = avgGains;
    let prevLosses = avgLosses;
    let prevPrice = _.last(periodPrices);

    this.values.push({
      date: afterPeriodDates.shift(),
      price: prevPrice,
      rsi: this.rsi(avgGains, avgLosses)
    });

    _.each(afterPeriodPrices, (price, idx) => {
      let d = afterPeriodDates[idx];
      let gain = 0;
      let loss = 0;
      let diff = price - prevPrice;

      if(diff > 0) {
        gain = diff;
      } else {
        loss = Math.abs(diff);
      }

      gain = ((prevGains * (this.period - 1)) + gain) / this.period;
      loss = ((prevLosses * (this.period - 1)) + loss) / this.period;

      this.values.push({
        date: d,
        price: price,
        rsi: this.rsi(gain, loss)
      });

      prevPrice = price;
      prevGains = gain;
      prevLosses = loss;
    });
  }

  /**
   *
   * @param avgGains
   * @param avgLosses
   * @return {number}
   */
  public rsi(avgGains: number, avgLosses: number): number {
    if(!avgLosses) {
      return 100.0;
    }
    let rs = avgGains / avgLosses;

    return +( 100.0 - ( 100.0 / ( 1.0 + rs ) )).toFixed(4);
  }

  /**
   * A bullish divergence occurs when the underlying security makes a lower low and RSI forms a higher low.
   * RSI does not confirm the lower low and this shows strengthening momentum.
   * A bearish divergence forms when the security records a higher high and RSI forms a lower high.
   * RSI does not confirm the new high and this shows weakening momentum.
   * @return {Line[]} divergences within `this.values`.
   * @todo
   */
  public findDivergences(): Line[] {
    let lines: Line[] = [];

    return lines;
  }

  /**
   *
   * @return {boolean} true if overbought.
   */
  public isOverbought(): boolean {
    return _.last(this.values).rsi > this.overboughtThreshold;
  }

  /**
   *
   * @return {boolean} true if over sold.
   */
  public isOversold(): boolean {
    return _.last(this.values).rsi < this.oversoldThreshold;
  }

  /**
   *
   * A bullish failure swing forms when RSI moves below 30 (oversold),
   * bounces above 30, pulls back, holds above 30 and then breaks its prior high.
   * It is basically a move to oversold levels and then a higher low above oversold levels.
   *
   * A bearish failure swing forms when RSI moves above 70,
   * pulls back, bounces, fails to exceed 70 and then breaks its prior low.
   * It is basically a move to overbought levels and then a lower high below overbought levels.
   * @return {FailureSwing[]}
   */
  public findFailureSwings(): FailureSwing[] {
    let failureSwings: FailureSwing[] = [];

    let oversold = false;
    let bounceAbove = false;
    let previousHigh = 0.0;

    let overbought = false;
    let bounceBelow = false;
    let previousLow = 0.0;

    let pullback = false;

    _.each(this.values, (v) => {
      if(bounceAbove) {
        if(v.rsi < this.oversoldThreshold) {
          bounceAbove = false;
          previousHigh = 0.0;
          oversold = true;
          pullback = false;
        } else if(v.rsi > previousHigh) {
          if(pullback) {
            failureSwings.push(new FailureSwing(v.price, v.rsi, v.date, true));
            bounceAbove = false;
            previousHigh = 0.0;
            pullback = false;
          } else {
            previousHigh = v.rsi;
          }
        } else {
          pullback = true;
        }
      } else if(bounceBelow) {
        if(v.rsi > this.overboughtThreshold) {
          bounceBelow = false;
          overbought = true;
          previousLow = 0.0;
          pullback = false;
        } else if(v.rsi < previousLow) {
          if(pullback) {
            failureSwings.push(new FailureSwing(v.price, v.rsi, v.date, false));
            bounceBelow = false;
            previousLow = 0.0;
            pullback = false;
          } else {
            previousLow = v.rsi;
          }
        } else {
          pullback = true;
        }
      } else if(oversold) {
        bounceAbove = v.rsi >= this.oversoldThreshold;
        if(bounceAbove) {
          oversold = false;
          previousHigh = v.rsi;
        }
      } else if(overbought) {
        bounceBelow = v.rsi <= this.overboughtThreshold;
        if(bounceBelow) {
          overbought = false;
          previousLow = v.rsi;
        }
      } else if(v.rsi > this.overboughtThreshold) {
        overbought = true;
      } else if(v.rsi < this.oversoldThreshold) {
        oversold = true;
      }
    });
    return failureSwings;
  }
}
