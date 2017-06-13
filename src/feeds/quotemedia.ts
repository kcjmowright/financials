import * as parse from 'csv-parse';
import {Buffer} from 'buffer';

import {HttpsFetch} from './https-fetch';

/**
 *
 * Requests quote data from quotemedia.com for the given ticker symbol and parses the response into an array of quote objects.
 */
export class Quotemedia extends HttpsFetch {
  public rawData: string = '';
  public data: any;

  constructor(public symbol: string, public date = new Date()) {
    super(`app.quotemedia.com`, `/quotetools/getHistoryDownload.csv?&webmasterId=501&startDay=01&startMonth=01` +
      `&startYear=2012&endDay=${date.getDate()}&endMonth=${date.getMonth()}&endYear=${date.getFullYear()}` +
      `&isRanged=true&symbol=${symbol}`);
  }

  public onData = (rawData) => {
    if(Buffer.isBuffer(rawData)) {
      this.rawData += rawData.toString('utf8');
    } else {
      this.rawData += rawData;
    }
  };

  public onEnd = (callback) => {
    parse(this.rawData, {
      auto_parse: true,
      auto_parse_date: false,
      columns: true,
      relax_column_count: true,
      trim: true
    }, (err, parsed) => {
      if(err) {
        console.log(err.message);
        return;
      }
      this.data = parsed;
      callback(parsed);
    });
  };
}

