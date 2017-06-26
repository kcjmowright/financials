import * as parse from 'csv-parse';
import * as moment from 'moment';
import * as Knex from 'knex';

import {HttpsFetchStream} from './https-fetch-stream';
import {IncomingMessage} from 'https';
import {Writable} from 'stream';

/**
 *
 */
export class QuotemediaStream extends HttpsFetchStream {

  constructor(public symbol: string, public startDate = moment('2012-01-01').toDate(), public endDate = new Date(), public knex: Knex) {
    super(`app.quotemedia.com`, `/quotetools/getHistoryDownload.csv?&webmasterId=501&startDay=${startDate.getDate()}` +
      `&startMonth=${startDate.getMonth() + 1}&startYear=${startDate.getFullYear()}&endDay=${endDate.getDate()}` +
      `&endMonth=${endDate.getMonth() + 1}&endYear=${endDate.getFullYear()}&isRanged=true&symbol=${encodeURIComponent(symbol)}`);
  }

  public onResponse = (res: IncomingMessage, callback: Function) => {
    let parser = parse({
      auto_parse: true,
      auto_parse_date: false,
      columns: true,
      relax_column_count: true,
      trim: true
    });
    let writable = new Writable({
      objectMode: true,
      write: (quote: any, enc, next) => {
        let ticker = this.symbol.toUpperCase();
        this.knex('quotes').insert({
          ticker: ticker,
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
        }).then(() => next(), next);
      }
    });
    writable.on('finish', callback);
    writable.on('error', (e) => callback(e));
    res.pipe(parser).pipe(writable);
  };
}
