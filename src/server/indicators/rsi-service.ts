import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {RelativeStrengthIndex} from '../../indicators';

export class RsiService {


  /**
   *
   * @param knex
   * @constructor
   */
  constructor(private knex: Knex) {}

  /**
   *
   * @param symbol
   * @param period
   * @param limit
   * @return {Promise<any>}
   */
  public getRsiForSymbolAndPeriod(symbol: string, period: number = 14, limit: number = 100): Promise<any> {
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
      let rsi = new RelativeStrengthIndex(results.map(data => data.close), results.map(data => data.date), period);

      return {
        values: rsi.values,
        overBought: rsi.isOverbought(),
        overSold: rsi.isOversold(),
        failureSwings: rsi.findFailureSwings()
      }
    });
  }

}
