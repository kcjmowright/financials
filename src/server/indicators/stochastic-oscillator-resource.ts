import {knex} from '../db';
import Route from '../route.decorator';
import {StochasticOscillatorService} from './stochastic-oscillator-service';

/**
 *
 */
export class StochasticOscillatorResource {

  public static stochasticOscillatorService = new StochasticOscillatorService(knex);

  @Route({
    method: 'GET',
    path: '/stochastic-oscillator/{symbol}'
  })
  public static getStochasticOscillatorForSymbolAndPeriod(request, reply) {
    let limit = parseInt(request.query.limit, 10);
    let period = parseInt(request.query.period, 10);
    let symbol = request.params.symbol;

    if(!symbol) {
      reply({
        message: `Malformed request, ticker symbol is not valid.`
      }).code(400).type('application/json');
      return;
    }
    if(isNaN(limit)) {
      limit = 100;
    }
    if(isNaN(period)) {
      period = 14;
    }
    let response = reply(StochasticOscillatorResource.stochasticOscillatorService
      .getStochasticOscillatorForSymbolAndPeriod(symbol, period, limit).then(result => {
      if(!result) {
        response.code(404);
        return {
          message: 'Ticker symbol not found.'
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

}
