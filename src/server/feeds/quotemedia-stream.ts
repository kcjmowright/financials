import * as parse from 'csv-parse';
import * as moment from 'moment';
import * as Knex from 'knex';

import {HttpsFetchStream} from './https-fetch-stream';
import {IncomingMessage} from 'https';
import {QuoteDbWritable} from './quote-db-writable';

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
    let writable = new QuoteDbWritable(this.knex, this.symbol);

    callback = callback || function() {};
    writable.on('finish', callback);
    writable.on('error', (e) => callback(e));
    parser.on('error', (e) => callback(e));
    res.pipe(parser).pipe(writable);
  };
}