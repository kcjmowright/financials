import {knex} from '../db';
import {JumpSignal} from '../../strategies';
import {MomentumSignal} from '../../strategies';
import {QuoteService} from '../company';
import {PageRequest, PageResults} from '../../shared';
import Route from '../route.decorator';
import {StrategyRunner} from '../../strategies';
import {Quote} from '../../company/quote';

/**
 *
 */
export class StrategiesResource {

  public static quoteService = new QuoteService(knex);

  @Route({
    method: 'GET',
    path: '/strategy/{symbol}'
  })
  public static getStrategyForSymbolAndPeriod(request, reply) {
    let startDate = request.query.startDate;
    let endDate = request.query.endDate;
    let symbol = request.params.symbol;
    let page = PageRequest.newPageRequest({
      dir: 'DESC',
      pageSize: 2520 // => Limit to 252 trading days per year * 10 years
    });

    if (!symbol) {
      reply({
        message: `Malformed request, ticker symbol is not valid.`
      }).code(400).type('application/json');
      return;
    }
    let response = reply(
      StrategiesResource.quoteService.findQuotes(symbol, startDate, endDate, page).then( (pageResults: PageResults<Quote>) => {
      if (!pageResults) {
        response.code(404);
        return {
          message: 'Ticker symbol not found.'
        };
      }
      let jumpSignal = new JumpSignal();
      let momentumSignal = new MomentumSignal();
      return new StrategyRunner(pageResults.results, [momentumSignal, jumpSignal]);
    }, e => {
      response.code(500);
      return {
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
    })).type('application/json');
  }
}
