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
   * @return {Promise}
   */
  public fetchQuotes(symbol?: string): Promise {
    let endDate = new Date();
    let knex = this.knex;

    return new Promise((resolve, reject) => {
      let queryBuilder = knex.select('companies.ticker')
        .max('quotes.date')
        .from('companies')
        .leftOuterJoin('quotes', 'companies.ticker', 'quotes.ticker');

      if(!!symbol) {
        queryBuilder = queryBuilder.where({
          'companies.ticker': symbol
        });
      }
      queryBuilder
        .groupBy('companies.ticker')
        .orderBy('companies.ticker', 'desc')
        .then((results) => {
          let calls = results.map((result) => futureCall(result.ticker, result.date));

          chain(calls, 0);
        }, (e) => reject(e));

      /**
       *
       * @param calls
       * @param index
       * @private
       */
      function chain(calls, index): Promise {
        if(index >= calls.length) {
          resolve();
        } else {
          calls[index]().then(() => chain(calls, index + 1), (e) => {
            console.log(`Error : ${e.message}`);
            chain(calls, index + 1);
          })
        }
      }
    });

    /**
     * @private
     * @param ticker
     * @param date
     * @return {()=>any}
     */
    function futureCall(ticker: string, date?: Date) {
      return function() {
        return new Promise((resolve, reject) => {
          let startDate = !!date ? moment(date).add(1, 'day').toDate() : moment('2012-01-01').toDate();

          if(moment(startDate).isAfter(moment(endDate))) {
            return resolve();
          }

          console.log(`ticker: ${ticker}, startDate: ${startDate}, endDate: ${endDate}`);
          new QuotemediaStream(ticker, startDate, endDate, knex).get((e) => {
            if(!!e) {
              console.log(e);
              return resolve();
            }
            resolve();
          });
        });
      }
    }
  }
}
