import * as Knex from 'knex';
import {Promise} from 'bluebird';

import {linearLeastSquares, ILinearLeastSquares} from '../../math';

export class LinearRegressionService {

  /**
   *
   * @param {Knex} knex db connection.
   * @constructor
   */
  constructor(private knex: Knex) {}

  /**
   *
   * @param {string} symbol ticker symbol.
   * @param {number} [limit=260] Limit of the number of data points.
   * @return {Promise<ILinearLeastSquares>}
   */
  public getLinearRegression(symbol: string, limit: number = 260): Promise<ILinearLeastSquares> {
    if(!symbol) {
      return Promise.reject(new Error('Invalid ticker symbol.'));
    }
    return this.knex('quotes').select('close', 'date').where({
      ticker: symbol.toUpperCase()
    }).orderBy('date', 'desc').limit(limit).then((quotes: any[]) => {
      if(!quotes.length) {
        return null;
      }
      let x = [];
      let y = [];

      quotes.forEach(quote => {
        x.push(quote.date.getTime());
        y.push(quote.close);
      });
      return linearLeastSquares(x, y);
    });
  }

}