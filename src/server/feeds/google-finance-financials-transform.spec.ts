import * as fs from 'fs';
import {GoogleFinanceFinancialsTransform} from './google-finance-financials-transform';
import {Writable} from 'stream';

describe('Transform: GoogleFinanceFinancialsTransform', () => {

  it('should transform google finance html into objects', (done: Function) => {
    let doc = '';
    let path = 'test';
    let symbol = 'NVDA';
    let obj;
    let transform = new GoogleFinanceFinancialsTransform(doc, path, symbol);
    let writable = new Writable({
      objectMode: true,
      write: (incomeStatement: any, enc: string, cb: Function) => {
        obj = incomeStatement;
        cb();
      }
    });

    transform.on('error', e => done(e));
    writable.on('finish', () => {
      expect(Array.isArray(obj)).toBe(true);
      expect(obj.length).toBe(3);
      console.log(JSON.stringify(obj, null, 2));
      done();
    });
    writable.on('error', e => done(e));
    fs.createReadStream('./src/server/feeds/google-finance-nvda-income-statement.html').pipe(transform).pipe(writable);
  });
});
