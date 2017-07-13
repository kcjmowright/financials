import * as moment from 'moment';
import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {QuotemediaStream} from './quotemedia-stream';

/**
 * Service to retrieve historical quotes from Quotemedia and insert them into the quotes table.
 */
export class QuotemediaQuoteService {
  constructor(public knex: Knex) {}

  /**
   *
   * @param {string} [symbol]
   * @param {Date} [startDate=1 year ago]
   * @return {Promise}
   */
  public fetchQuotes(symbol?: string, startDate: Date = moment().subtract(1, 'year').toDate()): Promise {
    let endDate = new Date();
    let knex = this.knex;

    return new Promise((resolve, reject) => {
      let queryBuilder = knex.select('ticker')
        .from('companies');

      if(!!symbol) {
        queryBuilder = queryBuilder.where({
          'ticker': symbol
        });
      }
      queryBuilder
        .orderBy('ticker', 'asc')
        .then((results) => {
          let calls = results.map((result) => futureCall(result.ticker));

          chain(calls, 0);
        }, (e) => reject(e));

      /**
       *
       * @param {Function[]} c
       * @param {number} index
       * @private
       */
      function chain(c: Function[], index: number) {
        if(index >= c.length) {
          resolve();
        } else {
          c[index]().then(() => chain(c, index + 1), (e) => {
            console.log(`Error : ${e.message}`);
            chain(c, index + 1);
          });
        }
      }
    });

    /**
     * @private
     * @param ticker
     * @return {()=>any}
     */
    function futureCall(ticker: string) {
      return function() {
        return new Promise((resolve, reject) => {
          console.log(`ticker: ${ticker}, startDate: ${startDate}, endDate: ${endDate}`);
          new QuotemediaStream(ticker, startDate, endDate, knex).get((e) => {
            if(!!e) {
              console.log(e.message);
            }
            resolve();
          });
        });
      };
    }
  }
}
