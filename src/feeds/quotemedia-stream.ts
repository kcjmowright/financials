import * as parse from 'csv-parse';
import * as transform from 'stream-transform';
import * as _ from 'lodash';

import {HttpsFetchStream} from './https-fetch-stream';
import {IncomingMessage} from 'https';

/**
 *
 * Requests quote data from quotemedia.com for the given ticker symbol and parses the response into an array of quote objects.
 */
export class QuotemediaStream extends HttpsFetchStream {
  public data: any[] = [];

  constructor(public symbol: string, public date = new Date()) {
    super(`app.quotemedia.com`, `/quotetools/getHistoryDownload.csv?&webmasterId=501&startDay=01&startMonth=01` +
      `&startYear=2012&endDay=${date.getDate()}&endMonth=${date.getMonth()}&endYear=${date.getFullYear()}` +
      `&isRanged=true&symbol=${symbol}`);
  }

  public onResponse = (res: IncomingMessage, callback?: Function) => {
    let parser = parse({
      auto_parse: true,
      auto_parse_date: false,
      columns: true,
      relax_column_count: true,
      trim: true
    });
    let transformer = transform((record, done) => {
      this.data.push(record);
      done();
    });
    transformer.on('finish', () => {
      if(_.isFunction(callback)) {
        callback(this.data);
      }
    });
    res.pipe(parser).pipe(transformer);
  };
}
