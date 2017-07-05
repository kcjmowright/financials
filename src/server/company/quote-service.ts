import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {Quote} from '../../company';
import {PageRequest} from '../../shared/page-request';
import {PageResults} from '../../shared/page-results';
import {DateUtil} from '../../shared/date-util';

export class QuoteService {

  constructor(private knex: Knex) {}

  /**
   *
   * @param {string} symbol
   * @param {Date} [startDate]
   * @param {Date} [endDate]
   * @param {PageRequest} [page]
   * @return {Promise<PageResults<Quote>>}
   */
  public findQuotes(symbol: string, startDate?: Date, endDate?: Date, page: PageRequest = new PageRequest()): Promise<PageResults<Quote>> {
    let queryBuilder = this.knex('quotes').where({
      ticker: symbol.toUpperCase()
    });
    if(!!startDate) {
      if(!endDate) {
        endDate = new Date();
      }
      queryBuilder = queryBuilder.whereBetween('date', [ startDate, endDate ]);
    }

    return queryBuilder
      .select('id', 'ticker', 'date', 'open', 'high', 'low',
        'close', 'volume', 'changed', 'changep', 'adjclose', 'tradeval', 'tradevol')
      .orderBy('date')
      .offset(page.getOffset())
      .limit(page.pageSize)
      .then((results) => {
        if(!results.length) {
          return null;
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
        let countQuery = this.knex('quotes').count('id').where({
          ticker: symbol.toUpperCase()
        });

        if(!!startDate) {
          countQuery = countQuery.whereBetween('date', [ startDate, endDate ]);
        }
        return countQuery.then((r) => {
          return new PageResults(list, r[0].count, page.page, page.pageSize);
        });
      });
  }

  public getQuote(symbol: string): Promise<Quote> {
    if(!symbol) {
      return Promise.reject(new Error('Ticker symbol not valid'));
    }
    return this.knex('quotes')
      .where({
        ticker: symbol.toUpperCase()
      })
      .select('id', 'ticker', 'date', 'open', 'high', 'low',
        'close', 'volume', 'changed', 'changep', 'adjclose', 'tradeval', 'tradevol')
      .orderBy('date', 'desc')
      .limit(1)
      .then((result) => {
        if(!result.length) {
          return null;
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
        return quote;
      });
  }

  /**
   *
   * @param {string} symbol
   * @param {number} period
   * @return {Promise}
   */
  public getAverageClosingPrice(symbol: string, period: number): Promise<any> {
    if(!symbol) {
      return Promise.reject(new Error('Ticker symbol not valid'));
    }
    symbol = symbol.toUpperCase();

    if(!period || isNaN(period) || period <= 0) {
      return Promise.reject(new Error('Period is not valid.'));
    }
    let periodEntries = this.knex('quotes')
      .where({
        ticker: symbol
      })
      .select('close')
      .orderBy('date', 'desc')
      .limit(period)
      .as('period_entries');

    return this.knex.from(periodEntries)
      .avg('close')
      .then((results) => {
        if(!results.length) {
          return null;
        }
        let avg = results[0].avg;

        return this.knex
          .raw(`select date, close, close::decimal/${avg} as ratio ` +
            `from quotes where ticker = ? order by date desc limit ?`, [symbol, period])
          .then((results) => {
            if(!results.rows.length) {
              return null;
            }
            return {
              symbol: symbol,
              averagePrice: avg,
              prices: results.rows.map(row => {
                return {
                  date: DateUtil.toISODateTimeString(row.date),
                  close: row.close,
                  ratio: row.ratio
                };
              })
            };
          });
      });
  }

  /**
   *
   * @param {string} symbol
   * @param {number} period
   * @return {Promise}
   */
  public getAverageVolume(symbol: string, period: number): Promise<any> {
    if(!symbol) {
      return Promise.reject(new Error('Invalid ticker symbol'));
    }
    symbol = symbol.toUpperCase();

    if(!period || isNaN(period) || period <= 0) {
      return Promise.reject(new Error('Invalid period'));
    }
    let periodEntries = this.knex('quotes')
      .where({
        ticker: symbol
      })
      .select('volume')
      .orderBy('date', 'desc')
      .limit(period)
      .as('period_entries');

    return this.knex.from(periodEntries)
      .avg('volume')
      .then((results) => {
        if(!results.length) {
          return null;
        }
        let avg = results[0].avg;

        return this.knex
          .raw(`select date, volume, volume::decimal/${avg} as ratio ` +
            `from quotes where ticker = ? order by date desc limit ?`, [symbol, period])
          .then((results) => {
            if(!results.rows.length) {
              return null;
            }
            return {
              symbol: symbol,
              averageVolume: avg,
              volumes: results.rows.map(row => {
                return {
                  date: DateUtil.toISODateTimeString(row.date),
                  volume: row.volume,
                  ratio: row.ratio
                };
              })
            };
          });
      });
  }

  /**
   *
   * @param {number} [period=22]
   * @return {Promise<any>}
   */
  public getTopPriceMovers(period: number = 22): Promise<any> {
    if(isNaN(period) || period <= 0) {
      period = 22;
    }
    return this.knex.raw(`with 
    last_x as (select q.date as date from quotes q where ticker = 'A' order by q.date desc limit ${period}),
    ticker_with_avg_close as (select q.ticker, avg(q.close) as avg_close from quotes q where q.date between (select min(date) from last_x) 
      and CURRENT_DATE group by q.ticker)
    select q.ticker, q.date, q.close, a.avg_close as averageClose, (q.close::decimal/a.avg_close) as ratio 
    from quotes q inner join ticker_with_avg_close a on q.ticker = a.ticker where a.avg_close > 0 AND q.date 
    in (select last_x.date from last_x limit 3) order by ratio desc limit 50`).then(result => {
      if(!result.rows.length) {
        return null;
      }
      return {
        period: period,
        quotes: result.rows
      };
    });
  }

  /**
   *
   * @param {number} [period=22]
   * @return {Promise<any>}
   */
  public getTopVolumeMovers(period: number = 22): Promise<any> {
    if(isNaN(period) || period <= 0) {
      period = 22;
    }
    return this.knex.raw(`with 
    last_x as (select q.date as date from quotes q where ticker = 'A' order by q.date desc limit ${period}),
    ticker_with_avg_volume as (select q.ticker, avg(q.volume) as avg_volume from quotes q where q.date between (select min(date) from last_x) 
      and CURRENT_DATE group by q.ticker)
    select q.ticker, q.date, q.volume, a.avg_volume as averageVolume, (q.volume::decimal/a.avg_volume) as ratio 
    from quotes q inner join ticker_with_avg_volume a on q.ticker = a.ticker where a.avg_volume > 0 AND q.date 
    in (select last_x.date from last_x limit 3) order by ratio desc limit 50`).then(result => {
      if(!result.rows.length) {
        return null;
      }
      return {
        period: period,
        quotes: result.rows
      };
    });
  }


  /**
   * @param {string} symbol
   * @param {number} [period=22]
   * @return {Promise<any>}
   */
  public getAverageVolumeAndPriceWithRatios(symbol: string, period: number = 22): Promise<any> {
    if(!symbol) {
      return Promise.reject(new Error('Expected valid symbol'));
    }
    if(isNaN(period) || period <= 0) {
      period = 22;
    }
    return this.knex.raw(
      `with last_x as (
        select q.date as date from quotes q where ticker = 'PRAN' order by q.date desc limit 22
      ),
      ticker_with_avg_close as (
        select q.ticker, avg(q.close) as avg_close from quotes q 
        where q.ticker = 'PRAN' and q.date between (select min(date) from last_x) 
        AND CURRENT_DATE group by q.ticker order by avg_close desc
      ),
      ticker_with_avg_volume as (
        select q.ticker, avg(q.volume) as avg_volume from quotes q 
        where q.ticker = 'PRAN' and q.date between (select min(date) from last_x) 
        AND CURRENT_DATE group by q.ticker order by avg_volume desc
      )
      select q.ticker, q.date, q.close, q.volume, av.avg_volume, ac.avg_close,
        (q.volume::decimal/av.avg_volume) as volumeratio, (q.close::decimal/ac.avg_close) as closeratio
        from quotes q 
        inner join ticker_with_avg_volume av on q.ticker = av.ticker 
        inner join ticker_with_avg_close ac on av.ticker = ac.ticker
        where q.date in (select last_x.date from last_x) order by q.date desc`)
      .then(result => {
        if(!result.rows.length) {
          return null;
        }
        return {
          symbol: symbol,
          period: period,
          quotes: result.rows
        };
      });
  }

  /**
   *
   * @param {Quote} quote
   * @return {Promise<Quote>}
   */
  public createQuote(quote: Quote): Promise<Quote> {
    if(!quote || !(quote instanceof Quote)) {
      return Promise.reject(new Error('Expecting Quote instance.'));
    }
    return this.knex('quotes').returning('id').insert({
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
      return quote;
    });
  }

  /**
   *
   * @param {Quote} quote
   * @return {Promise<void>}
   */
  public updateQuote(quote: Quote): Promise<void> {
    if(!quote || !quote.id) {
      return Promise.reject(new Error('Expecting a quote instance with a valid ID'));
    }
    return this.knex('quotes').where({
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
    });
  }

  /**
   *
   * @param {number} id
   * @return {Promise<void>}
   */
  public removeQuote(id: number): Promise<void> {
    if(isNaN(+id)) {
      return Promise.reject(new Error('Expected valid ID'));
    }
    return this.knex('quotes').where({
      id: +id
    }).del();
  }
}