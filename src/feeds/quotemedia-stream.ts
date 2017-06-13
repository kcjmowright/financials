import * as parse from 'csv-parse';
import * as transform from 'stream-transform';
import * as process from 'process';

import {HttpsFetchStream} from './https-fetch-stream';

/**
 *
 * Requests quote data from quotemedia.com for the given ticker symbol and parses the response into an array of quote objects.
 */
export class QuotemediaStream extends HttpsFetchStream {
  public rawData: string = '';
  public data: any;

  constructor(public symbol: string, public date = new Date()) {
    super(`app.quotemedia.com`, `/quotetools/getHistoryDownload.csv?&webmasterId=501&startDay=01&startMonth=01` +
      `&startYear=2012&endDay=${date.getDate()}&endMonth=${date.getMonth()}&endYear=${date.getFullYear()}` +
      `&isRanged=true&symbol=${symbol}`);
  }

  public onResponse = (res) => {
    let parser = parse({
      auto_parse: true,
      auto_parse_date: false,
      columns: true,
      relax_column_count: true,
      trim: true
    });
    let transformer = transform((record, callback) => {
      callback(null, JSON.stringify(record));
    });
    res.pipe(parser).pipe(transformer).pipe(process.stdout);
  };
}
