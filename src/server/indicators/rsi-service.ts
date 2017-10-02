import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {RelativeStrengthIndex} from '../../indicators';

export class RsiService {

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
  public getRsiForSymbolAndPeriod(symbol: string, period: number = 14, limit: number = 260): Promise<any> {
    if(!symbol) {
      return Promise.reject(new Error('Invalid ticker symbol.'));
    }
    return this.knex('quotes').select('x', 'y').where({
      ticker: symbol.toUpperCase()
    }).orderBy('x', 'desc').limit(limit).then((results) => {
      if(!results.length) {
        return null;
      }
      results = results.reverse();
      let rsi = new RelativeStrengthIndex(results.map(data => data.y), results.map(data => data.x), period);

      return {
        failureSwings: rsi.findFailureSwings(),
        overBought: rsi.isOverbought(),
        overSold: rsi.isOversold(),
        values: rsi.values
      };
    });
  }

}
