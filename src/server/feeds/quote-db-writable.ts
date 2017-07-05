import {Writable} from 'stream';
import * as moment from 'moment';
import * as Knex from 'knex';

export class QuoteDbWritable extends Writable {

  constructor(knex: Knex, symbol: string){
    super({
      objectMode: true,
      write: (quote: any, enc, next) => {
        knex('quotes').insert({
          ticker: symbol.toUpperCase(),
          date: moment(`${quote.date}T20:00:00-0000`).toDate(),
          open: isNaN(quote.open) ? null : quote.open,
          high: isNaN(quote.high) ? null : quote.high,
          low: isNaN(quote.low) ? null : quote.low,
          close: isNaN(quote.close) ? null : quote.close,
          volume: isNaN(quote.volume) ? null : quote.volume,
          changed: isNaN(quote.changed) ? null : quote.changed,
          changep: isNaN(parseFloat(quote.changep)) ? null : ( parseFloat(quote.changep) / 100.0 ),
          adjclose: isNaN(quote.adjclose) ? null : quote.adjclose,
          tradeval: isNaN(quote.tradeval) ? null : quote.tradeval,
          tradevol: isNaN(quote.tradevol) ? null : quote.tradevol
        }).then(() => next(), (e) => {
          console.log(e);
          next();
        });
      }
    })
  }
}
