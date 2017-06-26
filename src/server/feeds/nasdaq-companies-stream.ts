import * as parse from 'csv-parse';
import * as Knex from 'knex';

import {HttpFetchStream} from './http-fetch-stream';
import {IncomingMessage} from 'https';
import {Writable} from 'stream';

/**
 *
 *
 */
export class NasdaqCompaniesStream extends HttpFetchStream {

  constructor(public exchange: string, public knex: Knex) {
    super(`www.nasdaq.com`, `/screening/companies-by-industry.aspx?exchange=${exchange}&render=download`);
  }

  public onResponse = (res: IncomingMessage, callback?: Function) => {
    let parser = parse({
      auto_parse: true,
      auto_parse_date: false,
      columns: true,
      relax_column_count: true,
      trim: true
    });
    let writable = new Writable({
      objectMode: true,
      write: (company: any, enc, next) => {
        this.knex('companies').where({
          ticker: company.Symbol
        }).select('id').then((results) => {
          if(!results.length) {
            this.knex('companies').insert({
              name: company.Name,
              ticker: company.Symbol,
              sector: company.Sector,
              industry: company.Industry,
              exchange: this.exchange
            }).then(() => next(), next);
          } else {
            next();
          }
        }, next);
      }
    });
    writable.on('finish', callback);
    writable.on('error', (e) => callback(e));
    res.pipe(parser).pipe(writable);
  };
}
