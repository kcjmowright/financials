import {knex} from '../db';
import {RsiService} from './rsi-service';
import Route from '../route.decorator';

/**
 *
 */
export class RsiResource {

  public static rsiService = new RsiService(knex);

  @Route({
    method: 'GET',
    path: '/rsi/{symbol}'
  })
  public static getRsiForSymbolAndPeriod(request, reply) {
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
    let response = reply(RsiResource.rsiService.getRsiForSymbolAndPeriod(symbol, period, limit).then(result => {
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
