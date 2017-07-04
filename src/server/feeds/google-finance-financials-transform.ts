import * as cheerio from 'cheerio';
import {Transform} from 'stream';
import * as _ from 'lodash';
import * as moment from 'moment';

export class GoogleFinanceFinancialsTransform extends Transform {
  constructor(doc: string = '', path: string = '', symbol: string = '') {
   super({
     objectMode: true,
     transform: function(buf: string | Buffer, enc: string, next: Function) {
       doc += Buffer.isBuffer(buf) ? buf.toString('utf8') : buf;
       next();
     },
     flush: function(next: Function) {
       // console.log(`Flushing doc:\n${doc}`);
       symbol = symbol.toUpperCase();

       let $ = cheerio.load(doc);
       let $thead = $('#fs-table > thead').filter((i) => i % 2 === 0); // skip annual statements
       let $tbody = $('#fs-table > tbody').filter((i) => i % 2 === 0);
       let parsed = [{
         title: 'Income Statement',
         symbol: symbol,
         source: path,
         quarters: [{}, {}, {}, {}, {}]
       }, {
         title: 'Balance Statement',
         symbol: symbol,
         source: path,
         quarters: [{}, {}, {}, {}, {}]
       }, {
         title: 'Cash Flow',
         symbol: symbol,
         source: path,
         quarters: [{}, {}, {}, {}, {}]
       }];

       $thead.each((idx, thead) => {
         let $row = $(thead).find('tr');

         $row.each((i, row) => {
           let $th = $(row).find('th');

           $th.slice($th.length - 5).each((j, th) => {
             let match = $(th).text().trim().match(/\d{4}-\d{2}-\d{2}/);

             if(!!match) {
               parsed[idx].quarters[j]['endDate'] = moment(match[0], 'YYYY-MM-DD').toDate();
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
     }
   })
  }
}
