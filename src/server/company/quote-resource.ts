import {knex} from '../db';
import {DateUtil, PageRequest, PageResults} from '../../shared';
import {Promise} from 'bluebird';
import {Quote} from '../../company';
import register from '../server-register.decorator';
import {QuotemediaQuoteService} from '../feeds/quotemedia-quote-service';
import {QuoteService} from './quote-service';

export class QuoteResource {

  static quoteService = new QuoteService(knex);

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
    let page = PageRequest.newPageRequest(request.query);

    if(!ticker) {
      reply({
        message: `Malformed request, ticker is not valid.`
      }).code(400).type('application/json');
      return;
    }
    let response = reply(QuoteResource.quoteService.findQuotes(ticker, startDate, endDate, page).catch((quotes) => {
        if(!quotes) {
          response.code(404);
          return {
            message: `Quotes not found.`
          }
        }
        return quotes;
      }, e => {
        response.code(500);
        return {
          message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
        };
      })).type('application/json');
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
    let response = reply(QuoteResource.quoteService.getQuote(ticker).then((q) => {
      if(!q) {
        response.code(404);
        return {
          message: 'Quote not found'
        };
      }
      return q;
    }, e => {
      response.code(500);
      return {
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/{symbol}/average-price/{period}',
    method: 'GET'
  })
  public static getAverageClosingPrice(request, reply): void {
    let symbol = request.params.symbol;
    let period = parseInt(request.params.period);

    if(!symbol) {
      reply({
        message: `Malformed request, ticker symbol is not valid.`
      }).type('application/json').code(400);
      return;
    }

    if(!period || isNaN(period) || period <= 0) {
      reply({
        message: `Malformed request, period is not valid.`
      }).type('application/json').code(400);
      return;
    }

    let response = reply(QuoteResource.quoteService.getAverageClosingPrice(symbol, period).then(cp => {
      if(!cp) {
        response.code(404);
        return {
          message: 'Quote not found'
        };
      }
      return cp;
    }, e => {
      response.code(500);
      return {
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/{symbol}/average-volume/{period}',
    method: 'GET'
  })
  public static getAverageVolume(request, reply): void {
    let symbol = request.params.symbol;
    let period = parseInt(request.params.period);

    if(!symbol) {
      reply(JSON.stringify({
        message: `Malformed request, ticker is not valid.`
      })).code(400);
      return;
    }
    if(!period || isNaN(period) || period <= 0) {
      reply(JSON.stringify({
        message: `Malformed request, period is not valid.`
      })).code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.getAverageVolume(symbol, period).then(volume => {
      if(!volume) {
        response.code(404);
        return {
          message: 'Quote not found'
        };
      }
      return volume;
    }, e => {
      response.code(500);
      return {
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/{symbol}/average-volume-price/{period}',
    method: 'GET'
  })
  public static getAverageVolumeAndPrice(request, reply): void {
    let symbol = request.params.symbol;
    let period = parseInt(request.params.period);

    if(!symbol) {
      reply(JSON.stringify({
        message: `Malformed request, ticker is not valid.`
      })).code(400);
      return;
    }
    if(!period || isNaN(period) || period <= 0) {
      reply(JSON.stringify({
        message: `Malformed request, period is not valid.`
      })).code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.getAverageVolumeAndPriceWithRatios(symbol, period).then(volume => {
      if(!volume) {
        response.code(404);
        return {
          message: 'Quote not found'
        };
      }
      return volume;
    }, e => {
      response.code(500);
      return {
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/top-price-movers/{period}',
    method: 'GET'
  })
  public static getTopPriceMovers(request, reply): void {
    let period = parseInt(request.params.period);

    if(!period || isNaN(period) || period <= 0) {
      reply(JSON.stringify({
        message: `Malformed request, period is not valid.`
      })).code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.getTopPriceMovers(period).then(topMovers => {
      if(!topMovers) {
        response.code(404);
        return {
          message: 'Top movers not found'
        };
      }
      return topMovers;
    }, e => {
      response.code(500);
      return {
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/quote/top-volume-movers/{period}',
    method: 'GET'
  })
  public static getTopVolumeMovers(request, reply): void {
    let period = parseInt(request.params.period);

    if(!period || isNaN(period) || period <= 0) {
      reply(JSON.stringify({
        message: `Malformed request, period is not valid.`
      })).code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.getTopVolumeMovers(period).then(topMovers => {
      if(!topMovers) {
        response.code(404);
        return {
          message: 'Top movers not found'
        };
      }
      return topMovers;
    }, e => {
      response.code(500);
      return {
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
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
    let quote: Quote = Quote.newInstance(request.payload);

    if(!quote || !quote.ticker) {
      reply(JSON.stringify({
        message: 'Expected quote with a valid ticker'
      })).code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.createQuote(quote).then(q => q, e => {
      response.code(500);
      return {
        message: `Error: ${!!e.detail ? e.message : e.detail}.  See log for details.`
      };
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
    let quote = Quote.newInstance(request.payload);

    if(!quote.id || isNaN(+quote.id)) {
      reply(JSON.stringify({
        message: `expected valid id`
      })).code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.updateQuote(quote).then(() => response.code(204), e => {
      response.code(500);
      return {
        message: `Error: ${!!e.detail ? e.message : e.detail}.  See log for details.`
      };
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
  public static removeQuote(request, reply): void {
    let id = request.params.id;

    if (isNaN(+id)) {
      reply(JSON.stringify({
        message: `Malformed request, id is not valid.`
      })).code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.removeQuote(id).then(() => {
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
    let symbol = request.query.symbol;

    new QuotemediaQuoteService(knex).fetchQuotes(symbol).then(
      () => console.log('Done populating quotes.'),
      e => console.log(`Error populating quotes: ${e.message} ${e}`)
    );
    reply().code(204);
  }
}
