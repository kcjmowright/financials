import * as moment from 'moment';
import {knex} from '../db';
import {DateUtil, PageRequest, PageResults} from '../../shared';
import {Promise} from 'bluebird';
import {Quote} from '../../company';
import {QuotemediaStream} from '../feeds';
import register from '../server-register.decorator';

export class QuoteResource {

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/{ticker}',
    method: 'GET'
  })
  public static findQuotes(request, reply): void {
    let startDate = request.query.startDate;
    let endDate = request.query.endDate;
    let ticker = request.params.ticker;
    let page = PageRequest.clone(request.query);

    if(!ticker) {
      reply(JSON.stringify({
        message: `Malformed request, ticker is not valid.`
      })).code(400);
      return;
    }

    let queryBuilder = knex('quotes').where({
      ticker: ticker.toUpperCase()
    });
    if(!!startDate) {
      if(!endDate) {
        endDate = new Date();
      }
      queryBuilder = queryBuilder.whereBetween('date', [ startDate, endDate ]);
    }

    let response = reply(queryBuilder
      .select('id', 'ticker', 'date', 'open', 'high', 'low',
        'close', 'volume', 'changed', 'changep', 'adjclose', 'tradeval', 'tradevol')
      .orderBy('date')
      .offset(page.getOffset())
      .limit(page.pageSize)
      .then(
        (results) => {
          if(!results.length) {
            response.code(404);
            return JSON.stringify({
              message: `ticker not found`
            });
          }
          let list = results.map((r) => {
            let quote = new Quote();

            quote.id = r.id;
            quote.ticker = r.ticker;
            quote.date = DateUtil.toISODateTimeString(r.date);
            quote.open = r.open;
            quote.high = r.high;
            quote.low = r.low;
            quote.close = r.close;
            quote.volume = r.volume;
            quote.changed = r.changed;
            quote.changep = r.changep;
            quote.adjclose = r.adjclose;
            quote.tradeval = r.tradeval;
            quote.tradevol = r.tradevol;
            return quote;
          });
          let countQuery = knex('quotes').count('id').where({
            ticker: ticker.toUpperCase()
          });
          if(!!startDate) {
            countQuery = countQuery.whereBetween('date', [ startDate, endDate ]);
          }
          return countQuery.then((r) => {
            let pageResult = new PageResults(list, r[0].count, page.page, page.pageSize);

            return JSON.stringify(pageResult);
          }, (e) => {
            console.log(e);
            response.code(500);
            return JSON.stringify({
              message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
            });
          })
        },
        (e) => {
          console.log(e);
          response.code(500);
          return JSON.stringify({
            message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
          });
        }
      )).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/{ticker}/latest',
    method: 'GET'
  })
  public static getQuote(request, reply): void {
    let ticker = request.params.ticker;

    if(!ticker) {
      reply(JSON.stringify({
        message: `Malformed request, ticker is not valid.`
      })).code(400);
      return;
    }

    let response = reply(knex('quotes')
      .where({
        ticker: ticker.toUpperCase()
      })
      .select('id', 'ticker', 'date', 'open', 'high', 'low',
        'close', 'volume', 'changed', 'changep', 'adjclose', 'tradeval', 'tradevol')
      .orderBy('date', 'desc')
      .limit(1)
      .then((result) => {
        if(!result.length) {
          response.code(404);
          return JSON.stringify({
            message: `Quote not found.`
          });
        }
        let quote = new Quote();
        let r = result[0];

        quote.id = r.id;
        quote.ticker = r.ticker;
        quote.date = DateUtil.toISODateTimeString(r.date);
        quote.open = r.open;
        quote.high = r.high;
        quote.low = r.low;
        quote.close = r.close;
        quote.volume = r.volume;
        quote.changed = r.changed;
        quote.changep = r.changep;
        quote.adjclose = r.adjclose;
        quote.tradeval = r.tradeval;
        quote.tradevol = r.tradevol;
        return JSON.stringify(quote);
      }, (e) => {
        console.log(e);
        response.code(500);
        return JSON.stringify({
          message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
        });
      })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote',
    method: 'POST'
  })
  public static createQuote(request, reply): void {
    let quote: Quote = request.payload;

    if(!quote.ticker) {
      reply(JSON.stringify({
        message: `expected valid ticker`
      })).code(400);
      return;
    }

    let response = reply(knex('quotes').returning('id').insert({
      ticker: quote.ticker.toUpperCase(),
      date: DateUtil.toDateTime(quote.date),
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      volume: quote.volume,
      changed: quote.changed,
      changep: quote.changep,
      adjclose: quote.adjclose,
      tradeval: quote.tradeval,
      tradevol: quote.tradevol
    }).then((resp) => {
      quote.id = resp[0];
      return JSON.stringify(quote);
    }, (e) => {
      console.log(e);
      response.code(500);
      return JSON.stringify({
        message: `Error: ${!!e.detail ? e.message : e.detail}.  See log for details.`
      });
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote',
    method: 'PUT'
  })
  public static updateQuote(request, reply): void {
    let quote = request.payload;

    if(!quote.id || isNaN(+quote.id)) {
      reply(JSON.stringify({
        message: `expected valid id`
      })).code(400);
      return;
    }
    let response = reply(knex('quotes').where({
      id: quote.id
    }).update({
      ticker: quote.ticker.toUpperCase(),
      date: DateUtil.toDateTime(quote.date),
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      volume: quote.volume,
      changed: quote.changed,
      changep: quote.changep,
      adjclose: quote.adjclose,
      tradeval: quote.tradeval,
      tradevol: quote.tradevol
    }).then(() => {
      response.code(204);
      return;
    }, (e) => {
      console.log(e);
      response.code(500);
      return JSON.stringify({
        message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
      });
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/{id}',
    method: 'DELETE'
  })
  public static removeQuotes(request, reply): void {
    let id = request.params.id;

    if (isNaN(+id)) {
      reply(JSON.stringify({
        message: `Malformed request, id is not valid.`
      })).code(400);
      return;
    }

    let response = reply(knex('quotes').where({
      id: +id
    }).del().then(() => {
      response.code(204);
      return;
    }, (e) => {
      console.log(e);
      response.code(500);
      return JSON.stringify({
        message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
      });
    }));
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/populate',
    method: 'PUT'
  })
  public static populateQuotes(request, reply) {
    let endDate = new Date();

    new Promise((outerResolve, outerReject) => {
      knex.select('companies.ticker')
        .max('quotes.date')
        .from('companies')
        .leftOuterJoin('quotes', 'companies.ticker', 'quotes.ticker')
        .groupBy('companies.ticker')
        .then((results) => {
          let calls = results.map((result) => futureCall(result.ticker, result.date));

          chain(calls, 0);
        }, (e) => {
          outerReject(e);
        });

      function chain(calls, index): Promise {
        if(index >= calls.length) {
          outerResolve();
        } else {
          calls[index]().then(() => chain(calls, index + 1), (e) => {
            console.log(`Error : ${e.message}`);
            chain(calls, index + 1);
          })
        }
      }
    }).then(
      () => console.log('Done populating quotes.'),
      e => console.log(`Error populating quotes: ${e.message}`)
    );

    reply().code(202);

    function futureCall(ticker: string, date?: Date) {
      return function() {
        return new Promise((resolve, reject) => {
          let startDate = !!date ? moment(date).add(1, 'day').toDate() : moment('2012-01-01').toDate();

          console.log(`ticker: ${ticker}, startDate: ${startDate}, endDate: ${endDate}`);
          new QuotemediaStream(ticker, startDate, endDate, knex).get((e) => {
            if(!!e) {
              console.log(e);
              resolve();
              return;
            }
            resolve();
          });
        });
      }
    }
  }
}
