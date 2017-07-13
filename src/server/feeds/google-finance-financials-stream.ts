import {HttpsFetchStream} from './https-fetch-stream';
import {IncomingMessage} from 'https';
import {GoogleFinanceFinancialsTransform} from './google-finance-financials-transform';
import {FinancialsDbWritable} from './financials-db-writable';
import {knex} from '../db';

export class GoogleFinanceFinancialsStream extends HttpsFetchStream {

  /**
   *
   * @param symbol
   * @param exchange
   * @constructor
   */
  constructor(public symbol: string, public exchange: string) {
    super('www.google.com', `/finance?q=${encodeURIComponent(exchange.toUpperCase() + ':' + symbol.toUpperCase())}&fstype=ii`);
  }

  /**
   *
   * @param {IncomingMessage} res
   * @param {Function} [callback]
   */
  public onResponse = (res: IncomingMessage, callback?: Function) => {
    console.log(`Parsing response to ${this.host}${this.path}`);

    let transform = new GoogleFinanceFinancialsTransform('', this.path, this.symbol.toUpperCase());
    let writable = new FinancialsDbWritable(knex);

    transform.on('error', (e) => callback(e));
    writable.on('error', (e) => callback(e));
    writable.on('finish', () => {
      callback();
    });
    res.pipe(transform).pipe(writable);
  }
}
