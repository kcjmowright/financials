import * as cheerio from 'cheerio';
import {Transform} from 'stream';
import * as _ from 'lodash';
import * as moment from 'moment';

export class GoogleFinanceFinancialsTransform extends Transform {

  /**
   *
   * @param {string} [doc='']
   * @param {string} [path='']
   * @param {string} [symbol='']
   * @constructor
   */
  constructor(doc: string = '', path: string = '', symbol: string = '') {
   super({
     flush: function flush(next: Function) {

       symbol = symbol.toUpperCase();

       let $ = cheerio.load(doc);
       let $thead = $('#fs-table > thead').filter((i) => i % 2 === 0); // skip annual statements
       let $tbody = $('#fs-table > tbody').filter((i) => i % 2 === 0);
       let parsed = [{
         quarters: [{}, {}, {}, {}, {}],
         source: path,
         symbol: symbol,
         title: 'Income Statement'
       }, {
         quarters: [{}, {}, {}, {}, {}],
         source: path,
         symbol: symbol,
         title: 'Balance Statement'
       }, {
         quarters: [{}, {}, {}, {}, {}],
         source: path,
         symbol: symbol,
         title: 'Cash Flow'
       }];

       $thead.each((idx, thead) => {
         let $row = $(thead).find('tr');

         $row.each((i, row) => {
           let $th = $(row).find('th');

           $th.slice($th.length - 5).each((j, th) => {
             let match = $(th).text().trim().match(/\d{4}-\d{2}-\d{2}/);

             if(!!match) {
               /* tslint:disable no-string-literal */
               parsed[idx].quarters[j]['endDate'] = moment(match[0], 'YYYY-MM-DD').toDate();
               /* tslint:enable no-string-literal */
             }
           });
         });
       });
       $tbody.each((idx, tbody) => {
         let $row = $(tbody).find('tr');

         $row.each((i, row) => {
           let $td = $(row).find('td');
           let key = _.camelCase($td.eq(0).text());

           $td.slice($td.length - 5).each((j, td) => {
             let value = parseFloat($(td).text().replace(/\(/g, '-').replace(/[^0-9()-.]/g, ''));

             if(isNaN(value)) {
               value = 0;
             }
             parsed[idx].quarters[j][key] = value;
           });
         });
       });
       this.push(parsed);
       next();
     },
     objectMode: true,
     transform: function transform(buf: string | Buffer, enc: string, next: Function) {
       doc += Buffer.isBuffer(buf) ? buf.toString('utf8') : buf;
       next();
     }
   });
  }
}
