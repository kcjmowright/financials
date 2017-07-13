import {knex} from '../db';
import {DateUtil, PageRequest} from '../../shared';
import {Promise} from 'bluebird';
import {Quote} from '../../company';
import {QuotemediaQuoteService} from '../feeds/quotemedia-quote-service';
import {QuoteService} from './quote-service';
import Route from '../route.decorator';

export class QuoteResource {

  static quoteService = new QuoteService(knex);

  /**
   *
   * @param request
   * @param reply
   */
  @Route({
    method: 'GET',
    path: '/quote/{ticker}'
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
    let response = reply(QuoteResource.quoteService.findQuotes(ticker, startDate, endDate, page).catch(e => {
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
  @Route({
    method: 'GET',
    path: '/quote/{ticker}/latest'
  })
  public static getQuote(request, reply): void {
    let ticker = request.params.ticker;

    if(!ticker) {
      reply({
        message: `Malformed request, ticker is not valid.`
      }).type('application/json').code(400);
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
  @Route({
    method: 'GET',
    path: '/quote/{symbol}/average-price/{period}'
  })
  public static getAverageClosingPrice(request, reply): void {
    let symbol = request.params.symbol;
    let period = parseInt(request.params.period, 10);

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
  @Route({
    method: 'GET',
    path: '/quote/{symbol}/average-volume/{period}'
  })
  public static getAverageVolume(request, reply): void {
    let symbol = request.params.symbol;
    let period = parseInt(request.params.period, 10);

    if(!symbol) {
      reply({
        message: `Malformed request, ticker is not valid.`
      }).type('application/json').code(400);
      return;
    }
    if(!period || isNaN(period) || period <= 0) {
      reply({
        message: `Malformed request, period is not valid.`
      }).type('application/json').code(400);
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
  @Route({
    method: 'GET',
    path: '/quote/{symbol}/average-volume-price/{period}'
  })
  public static getAverageVolumeAndPrice(request, reply): void {
    let symbol = request.params.symbol;
    let period = parseInt(request.params.period, 10);

    if(!symbol) {
      reply({
        message: `Malformed request, ticker is not valid.`
      }).type('application/json').code(400);
      return;
    }
    if(!period || isNaN(period) || period <= 0) {
      reply({
        message: `Malformed request, period is not valid.`
      }).type('application/json').code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.getAverageVolumeAndPriceWithRatios(symbol, period).then(result => {
      if(!result) {
        response.code(404);
        return {
          message: 'Quote not found'
        };
      }
      return result;
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
  @Route({
    method: 'GET',
    path: '/quote/top-price-movers/{period}'
  })
  public static getTopPriceMovers(request, reply): void {
    let period = parseInt(request.params.period, 10);
    let minPrice = parseInt(request.query.minprice, 10);

    if(!period || isNaN(period) || period <= 0) {
      reply({
        message: `Malformed request, period is not valid.`
      }).type('application/json').code(400);
      return;
    }
    if(isNaN(minPrice) || minPrice < 0) {
      minPrice = 0;
    }
    let response = reply(QuoteResource.quoteService.getTopPriceMovers(period, minPrice).then(topMovers => {
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
  @Route({
    method: 'GET',
    path: '/quote/top-volume-movers/{period}'
  })
  public static getTopVolumeMovers(request, reply): void {
    let period = parseInt(request.params.period, 10);
    let minPrice = parseInt(request.query.minprice, 10);

    if(isNaN(period) || period <= 0) {
      reply({
        message: `Malformed request, period is not valid.`
      }).type('application/json').code(400);
      return;
    }
    if(isNaN(minPrice) || minPrice < 0) {
      minPrice = 0;
    }
    let response = reply(QuoteResource.quoteService.getTopVolumeMovers(period, minPrice).then(topMovers => {
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
  @Route({
    method: 'POST',
    path: '/quote'
  })
  public static createQuote(request, reply): void {
    let quote: Quote = Quote.newInstance(request.payload);

    if(!quote || !quote.ticker) {
      reply({
        message: 'Expected quote with a valid ticker'
      }).type('application/json').code(400);
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
  @Route({
    method: 'PUT',
    path: '/quote'
  })
  public static updateQuote(request, reply): void {
    let quote = Quote.newInstance(request.payload);

    if(!quote.id || isNaN(+quote.id)) {
      reply({
        message: `expected valid id`
      }).type('application/json').code(400);
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
  @Route({
    method: 'DELETE',
    path: '/quote/{id}'
  })
  public static removeQuote(request, reply): void {
    let id = request.params.id;

    if (isNaN(+id)) {
      reply({
        message: `Malformed request, id is not valid.`
      }).type('application/json').code(400);
      return;
    }
    let response = reply(QuoteResource.quoteService.removeQuote(id).then(() => {
      response.code(204);
      return;
    }, e => {
      console.log(e);
      response.code(500);
      return {
        message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @Route({
    method: 'PUT',
    path: '/quote/populate'
  })
  public static populateQuotes(request, reply) {
    let symbol = request.query.symbol;
    let startDate = request.query.startDate;

    if(!!startDate) {
      startDate = DateUtil.toDateTime(startDate);
    }
    new QuotemediaQuoteService(knex).fetchQuotes(symbol, startDate).then(
      () => console.log('Done populating quotes.'),
      e => console.log(`Error populating quotes: ${e.message} ${e}`)
    );
    reply().code(204);
  }
}
