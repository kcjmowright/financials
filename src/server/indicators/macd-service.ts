import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {MovingAverageConvergenceDivergence} from '../../indicators';

export class MacdService {

  /**
   *
   * @param knex
   * @constructor
   */
  constructor(private knex: Knex) {}

  /**
   *
   * @param {string} symbol Ticker symbol.
   * @param {number} [longPeriod=26]
   * @param {number} [shortPeriod=12]
   * @param {number} [signalPeriod=9]
   * @param {number} [limit=260]
   * @return {Promise<MovingAverageConvergenceDivergence>}
   */
  public getMacdForSymbol(symbol: string, longPeriod: number = 26, shortPeriod: number = 12, signalPeriod: number = 9,
                          limit: number = 260): Promise<MovingAverageConvergenceDivergence> {
    if(!symbol) {
      return Promise.reject(new Error('Invalid ticker symbol.'));
    }
    return this.knex('quotes').select('close', 'date').where({
      ticker: symbol.toUpperCase()
    }).orderBy('date', 'desc').limit(limit).then((results) => {
      if(!results.length) {
        return null;
      }
      results = results.reverse();
      return new MovingAverageConvergenceDivergence(results, longPeriod,
        shortPeriod, signalPeriod);
    });
  }

}
