import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {GoogleFinanceFinancialsStream} from './google-finance-financials-stream';

export class GoogleFinanceFinancialsService {

  constructor(public knex: Knex) {
  }

  public fetchFinancials(): Promise {
    new Promise((resolve, reject) => {
      this.knex('companies').select(['ticker', 'exchange'])
        .orderBy('ticker')
        .then((results) => {
          let calls = results.map((result) => futureCall(result.ticker, result.exchange));

          chain(calls, 0);

          /**
           *
           * @param c
           * @param index
           * @private
           */
          function chain(c, index): void {
            if(index >= c.length) {
              resolve();
            } else {
              c[index]().then(() => chain(c, index + 1), (e) => {
                console.log(`Error : ${e.message}`);
                chain(c, index + 1);
              });
            }
          }
        }, (e) => {
          reject(e);
        });
    }).then(
      () => console.log('Done populating financials.'),
      e => console.log(`Error populating financials: ${e.message}`)
    );

    function futureCall(symbol: string, exchange: string) {
      console.log(`queueing ${exchange}:${symbol}`);
      return function() {
        return new Promise((resolve, reject) => {
          setTimeout(() => new GoogleFinanceFinancialsStream(symbol, exchange).get((e) => {
            if(!!e) {
              console.log(e);
              resolve();
              return;
            }
            resolve();
          }), 5000);
        });
      };
    }

  }
}
