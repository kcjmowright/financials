import {Writable} from 'stream';
import * as moment from 'moment';
import * as Knex from 'knex';

export class QuoteDbWritable extends Writable {

  /**
   *
   * @param {Knex} knex db connection.
   * @param {string} symbol ticker symbol.
   * @constructor
   */
  constructor(knex: Knex, symbol: string) {
    super({
      objectMode: true,
      write: (quote: any, enc, next) => {
        knex('quotes').insert({
          adjclose: isNaN(quote.adjclose) ? null : quote.adjclose,
          changed: isNaN(quote.changed) ? null : quote.changed,
          changep: isNaN(parseFloat(quote.changep)) ? null : ( parseFloat(quote.changep) / 100.0 ),
          high: isNaN(quote.high) ? null : quote.high,
          low: isNaN(quote.low) ? null : quote.low,
          open: isNaN(quote.open) ? null : quote.open,
          ticker: symbol.toUpperCase(),
          tradeval: isNaN(quote.tradeval) ? null : quote.tradeval,
          tradevol: isNaN(quote.tradevol) ? null : quote.tradevol,
          volume: isNaN(quote.volume) ? null : quote.volume,
          x: moment(`${quote.date}T20:00:00-0000`).toDate(),
          y: isNaN(quote.close) ? null : quote.close
        }).then(() => next(), (e) => {
          console.log(e);
          next();
        });
      }
    });
  }
}
