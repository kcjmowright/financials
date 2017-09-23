import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {Quote} from '../../company';
import {PageRequest} from '../../shared/page-request';
import {PageResults} from '../../shared/page-results';
import {DateUtil} from '../../shared/date-util';

/**
 * Company quote metrics service.
 */
export class QuoteService {

  /**
   *
   * @param knex
   * @constructor
   */
  constructor(private knex: Knex) {}

  /**
   *
   * @param {string} symbol Ticker symbol.
   * @param {Date} [startDate] optional start date.
   * @param {Date} [endDate] optional end date.
   * @param {PageRequest} [page] optional page.
   * @return {Promise<PageResults<Quote>>}
   */
  public findQuotes(symbol: string, startDate?: Date, endDate?: Date, page: PageRequest = new PageRequest()): Promise<PageResults<Quote>> {
    if(!symbol) {
      return Promise.reject(new Error('Invalid symbol'));
    }
    let queryBuilder = this.knex('quotes').where({
      ticker: symbol.toUpperCase()
    });
    if(!!startDate) {
      if(!endDate) {
        endDate = new Date();
      }
      queryBuilder = queryBuilder.whereBetween('x', [ startDate, endDate ]);
    }

    return queryBuilder
      .select('id', 'ticker', 'x', 'open', 'high', 'low',
        'y', 'volume', 'changed', 'changep', 'adjclose', 'tradeval', 'tradevol')
      .orderBy('x' , page.dir)
      .offset(page.getOffset())
      .limit(page.pageSize)
      .then((results) => {
        let list = results.map((r) => {
          let quote = new Quote();

          quote.id = r.id;
          quote.ticker = r.ticker;
          quote.x = r.x.getTime();
          quote.open = r.open;
          quote.high = r.high;
          quote.low = r.low;
          quote.y = r.y;
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
          countQuery = countQuery.whereBetween('x', [ startDate, endDate ]);
        }
        return countQuery.then((r) => {
          return new PageResults(list, r[0].count, page.page, page.pageSize, 'x', page.dir);
        });
      });
  }

  /**
   *
   * @param symbol Ticker symbol
   * @return {Promise<Quote>}
   */
  public getQuote(symbol: string): Promise<Quote> {
    if(!symbol) {
      return Promise.reject(new Error('Ticker symbol not valid'));
    }
    return this.knex('quotes')
      .where({
        ticker: symbol.toUpperCase()
      })
      .select('id', 'ticker', 'x', 'open', 'high', 'low',
        'y', 'volume', 'changed', 'changep', 'adjclose', 'tradeval', 'tradevol')
      .orderBy('x', 'desc')
      .limit(1)
      .then((result) => {
        if(!result.length) {
          return null;
        }
        let quote = new Quote();
        let r = result[0];

        quote.id = r.id;
        quote.ticker = r.ticker;
        quote.x = r.x.getTime();
        quote.open = r.open;
        quote.high = r.high;
        quote.low = r.low;
        quote.y = r.y;
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
   * @return {Promise<any>}
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
      .select('y')
      .orderBy('x', 'desc')
      .limit(period)
      .as('period_entries');

    return this.knex.from(periodEntries)
      .avg('y')
      .then((results) => {
        if(!results.length) {
          return null;
        }
        let avg = results[0].avg;

        return this.knex
          .raw(`select x, y, y::decimal/${avg} as ratio ` +
            `from quotes where ticker = ? order by x desc limit ?`, [symbol, period])
          .then(avgPriceRatios => {
            if(!avgPriceRatios.rows.length) {
              return null;
            }
            return {
              averagePrice: avg,
              prices: avgPriceRatios.rows.map(row => {
                return {
                  date: DateUtil.toISODateTimeString(row.x),
                  price: row.y,
                  ratio: row.ratio
                };
              }),
              symbol: symbol
            };
          });
      });
  }

  /**
   *
   * @param {string} symbol Ticker symbol
   * @param {number} period number of trading days, must be greater than 0.
   * @return {Promise<any>}
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
      .orderBy('x', 'desc')
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
          .raw(`select x, volume, volume::decimal/${avg} as ratio ` +
            `from quotes where ticker = ? order by x desc limit ?`, [symbol, period])
          .then(avgVolumeRatios => {
            if(!avgVolumeRatios.rows.length) {
              return null;
            }
            return {
              averageVolume: avg,
              symbol: symbol,
              volumes: avgVolumeRatios.rows.map(row => {
                return {
                  date: DateUtil.toISODateTimeString(row.x),
                  ratio: row.ratio,
                  volume: row.volume
                };
              })
            };
          });
      });
  }

  /**
   *
   * @param {number} [period=22] number of days defaults to 22.
   * @param {number} [minPrice=0] minimum price threshold defaults to 0.
   * @return {Promise<any>}
   */
  public getTopPriceMovers(period: number = 22, minPrice: number = 0): Promise<any> {
    if(isNaN(period) || period <= 0) {
      period = 22;
    }
    if(isNaN(minPrice) || minPrice < 0) {
      minPrice = 0;
    }
    return this.knex.raw(`with last_x as (
      select q.x as x from quotes q where ticker = 'A' order by q.x desc limit ${period}
    ),
    ticker_with_avg_close as (
      select q.ticker, avg(q.y) as avg_close
      from quotes q where q.x between (select min(x) from last_x) and CURRENT_DATE group by q.ticker
    )
    select q.ticker, q.x, q.y, q.volume, a.avg_close as averageClose, (q.y::decimal/a.avg_close) as ratio
    from quotes q inner join ticker_with_avg_close a on q.ticker = a.ticker where a.avg_close >= :min_price and a.avg_close > 0 AND q.x
    in (select last_x.x from last_x limit 3) order by ratio desc limit 50`, {
      min_price: minPrice
    }).then(result => {
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
   * @param {number} [period=22] Number of days defaults to 22.
   * @param {number} [minPrice=0] Closing price minimum threshold defaults to 0.
   * @return {Promise<any>}
   */
  public getTopVolumeMovers(period: number = 22, minPrice: number = 0): Promise<any> {
    if(isNaN(period) || period <= 0) {
      period = 22;
    }
    return this.knex.raw(`with last_x as (
      select q.x as x from quotes q where ticker = 'A' order by q.x desc limit ${period}
    ),
    ticker_with_avg_volume as (
      select q.ticker, avg(q.volume) as avg_volume
      from quotes q where q.x between (select min(x) from last_x) and CURRENT_DATE group by q.ticker
    )
    select q.ticker, q.x, q.y, q.volume, a.avg_volume as averageVolume, (q.volume::decimal/a.avg_volume) as ratio
    from quotes q inner join ticker_with_avg_volume a on q.ticker = a.ticker where q.y >= :min_price and a.avg_volume > 0 AND q.x
    in (select last_x.x from last_x limit 3) order by ratio desc limit 50`, {
      min_price: minPrice
    }).then(result => {
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
   * Get the average volume and average price for a given ticker symbol and period in days and compare the volume and price to their averages.
   *
   * @param {string} symbol Ticker symbol.
   * @param {number} [period=22] Number of days defaults to 22.
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
        select q.x as x from quotes q where ticker = :symbol order by q.x desc limit ${period}
      ),
      ticker_with_avg_close as (
        select q.ticker, avg(q.y) as avg_close from quotes q
        where q.ticker = :symbol and q.x between (select min(x) from last_x)
        AND CURRENT_DATE group by q.ticker order by avg_close desc
      ),
      ticker_with_avg_volume as (
        select q.ticker, avg(q.volume) as avg_volume from quotes q
        where q.ticker = :symbol and q.x between (select min(x) from last_x)
        AND CURRENT_DATE group by q.ticker order by avg_volume desc
      )
      select q.ticker, q.x, q.y, q.volume, av.avg_volume, ac.avg_close,
        (q.volume::decimal/av.avg_volume) as volumeratio, (q.y::decimal/ac.avg_close) as closeratio
        from quotes q
        inner join ticker_with_avg_volume av on q.ticker = av.ticker
        inner join ticker_with_avg_close ac on av.ticker = ac.ticker
        where q.x in (select last_x.x from last_x) order by q.x desc`, {
        symbol: symbol.toUpperCase()
      })
      .then(result => {
        if(!result.rows.length) {
          return null;
        }
        return {
          averagePrice: result.rows[0].avg_close,
          averageVolume: result.rows[0].avg_volume,
          period: period,
          quotes: result.rows.map(row => {
            return {
              date: DateUtil.toISODateTimeString(row.x),
              price: row.y,
              priceRatio: row.closeratio,
              volume: row.volume,
              volumeRatio: row.volumeratio
            };
          }),
          symbol: symbol
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
      adjclose: quote.adjclose,
      changed: quote.changed,
      changep: quote.changep,
      high: quote.high,
      low: quote.low,
      open: quote.open,
      ticker: quote.ticker.toUpperCase(),
      tradeval: quote.tradeval,
      tradevol: quote.tradevol,
      volume: quote.volume,
      x: new Date(quote.x),
      y: quote.y,
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
    if(!quote || !quote.id || isNaN(quote.id)) {
      return Promise.reject(new Error('Expecting a quote instance with a valid ID'));
    }
    return this.knex('quotes').where({
      id: quote.id
    }).update({
      adjclose: quote.adjclose,
      changed: quote.changed,
      changep: quote.changep,
      high: quote.high,
      low: quote.low,
      open: quote.open,
      ticker: quote.ticker.toUpperCase(),
      tradeval: quote.tradeval,
      tradevol: quote.tradevol,
      volume: quote.volume,
      x: new Date(quote.x),
      y: quote.y
    });
  }

  /**
   *
   * @param {number} id
   * @return {Promise<void>}
   */
  public removeQuote(id: number): Promise<void> {
    if(isNaN(id)) {
      return Promise.reject(new Error('Expected valid ID'));
    }
    return this.knex('quotes').where({
      id: id
    }).del();
  }
}
