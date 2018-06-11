import * as parse from 'csv-parse';
import * as Knex from 'knex';

import {HttpsFetchStream} from './https-fetch-stream';
import {IncomingMessage} from 'https';
import {Writable} from 'stream';

/**
 * Calls Nasdaq to acquire a list of companies by exchange, parses and pipes the result to a db.
 */
export class NasdaqCompaniesStream extends HttpsFetchStream {

  /**
   *
   * @param {string} exchange a market exchange identifier, i.e. NASDAQ, NYSE, AMEX.
   * @param {Knex} knex the db connection.
   * @constructor
   */
  constructor(public exchange: string, public knex: Knex) {
    super(`www.nasdaq.com`, `/screening/companies-by-industry.aspx?exchange=${exchange}&render=download`);
  }

  /**
   *
   * @param {IncomingMessage} res
   * @param {Function} [callback] Optional callback function invoked on stream 'finish';
   */
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
              exchange: this.exchange,
              industry: company.Industry,
              name: company.Name,
              sector: company.Sector,
              ticker: company.Symbol
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
  }
}
