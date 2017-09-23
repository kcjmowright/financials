import * as _ from 'lodash';

import {Quote} from '../company';
import {average} from '../math';

/**
 * k = (Most Recent Price - Period Low)/(Period High - Period Low) * 100
 *
 * Where:
 *  k = the current calculated value
 *  d = 3-period simple moving average of k
 */
export class StochasticOscillator {

  /**
   * The calculated values.
   */
  public values: { date: number, k: number, d: number }[];

  /**
   *
   * @param {Quote[]} [quotes=[]] Optional quote values.
   * @param {number} [period=14] the optional period range.
   * @constructor
   */
  constructor(public quotes: Quote[] = [], public period: number = 14) {
    this.values = [];
    this.calculate();
  }

  /**
   * Calculates k and d values for `this.quotes`.
   */
  public calculate = () => {
    if(this.period <= this.quotes.length) {
      for(let idx = this.period; idx <= this.quotes.length; idx++) {
        let slice = _.slice(this.quotes, idx - this.period, idx);
        let [min, max] = this.calculateMinMax(slice);
        let quote = _.last(slice);
        let value = {
          d: undefined,
          date: quote.x,
          k: (quote.y - min) / (max - min) * 100.0
        };

        this.values.push(value);
        if(this.values.length >= 3) {
          value.d = average(_.map(_.slice(this.values, -3), v => v.k));
        }
      }
    }
  }

  /**
   * Modifies `this` object by calculating a new value for k and d and pushing the result onto `this.values`.
   *
   * @param {Quote} quote.
   */
  public addQuote = (quote: Quote) => {
    this.quotes.push(quote);
    if(this.period <= this.quotes.length) {
      let slice = _.slice(this.quotes, -this.period);
      let [min, max] = this.calculateMinMax(slice);
      let value = {
        d: undefined,
        date: quote.x,
        k: (quote.y - min) / (max - min) * 100
      };

      this.values.push(value);
      if (this.values.length >= 3) {
        value.d = average(_.map(_.slice(this.values, -3), v => v.k));
      }
    }
  }

  /**
   *
   * @param {Quote[]} quotes a range of quotes.
   * @returns {number[]} the min and max of the given quotes.
   */
  private calculateMinMax = (quotes: Quote[]): number[] => {
    let max = 0;
    let min = 0;

    quotes.forEach((quote: Quote) => {
      if(!max || max < quote.high) {
        max = quote.high;
      }
      if(!min || min > quote.low) {
        min = quote.low;
      }
    });
    return [min, max];
  }

}
