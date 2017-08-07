import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {GoogleFinanceFinancialsStream} from './google-finance-financials-stream';

export class GoogleFinanceFinancialsService {

  constructor(public knex: Knex) {
  }

  /**
   * Calls google finance to retrieve financial data for each ticker symbol in the DB, parses the response and populates the DB with the result.
   * @return {Promise}
   */
  public populateFinancials(): Promise {
    return new Promise((resolve, reject) => {
      this.knex('companies').select(['ticker', 'exchange'])
        .orderBy('ticker')
        .then(handleResults, handleError);

      /**
       * @private
       * @param results
       */
      function handleResults(results) {
        chain(results.map((result) => deferCall(result.ticker, result.exchange)), 0);
      }

      /**
       * @private
       * @param {Error} error
       */
      function handleError(error: Error) {
        reject(error);
      }

      /**
       *
       * @param calls
       * @param index
       * @private
       */
      function chain(calls, index): void {
        if(index >= calls.length) {
          resolve();
        }
        calls[index]().then(() => chain(calls, index + 1), (error: Error) => {
          console.log(`Error : ${error.message}`);
          chain(calls, index + 1);
        });
      }
    });

    /**
     * @private
     * @param symbol
     * @param exchange
     * @return {()=>any}
     */
    function deferCall(symbol: string, exchange: string) {
      console.log(`queueing ${exchange}:${symbol}`);
      return function() {
        return new Promise((resolve) => {
          setTimeout(() => new GoogleFinanceFinancialsStream(symbol, exchange).get((error) => {
            if(!!error) {
              console.log(error);
            }
            resolve();
          }), 3000); // Delay calls by 3 seconds.
        });
      };
    }
  }
}
