import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {StochasticOscillator} from '../../indicators';

export class StochasticOscillatorService {

  /**
   *
   * @param {Knex} knex db connection.
   * @constructor
   */
  constructor(private knex: Knex) {}

  /**
   *
   * @param {string} symbol ticker symbol.
   * @param {number} [period=14] Number of days.
   * @param {number} [limit=260] Limit of the number of data points.
   * @return {Promise<any>}
   */
  public getStochasticOscillatorForSymbolAndPeriod(symbol: string, period: number = 14, limit: number = 260): Promise<any> {
    if(!symbol) {
      return Promise.reject(new Error('Invalid ticker symbol.'));
    }
    return this.knex('quotes').select('x', 'y', 'high', 'low').where({
      ticker: symbol.toUpperCase()
    }).orderBy('x', 'desc').limit(limit).then((quotes) => {
      if(!quotes.length) {
        return null;
      }
      return new StochasticOscillator(quotes.reverse(), period);
    });
  }

}
