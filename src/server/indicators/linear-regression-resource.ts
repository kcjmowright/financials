import {knex} from '../db';

import {LinearRegressionService} from './linear-regression-service';
import Route from '../route.decorator';

export class LinearRegressionResource {

  public static linearRegressionService = new LinearRegressionService(knex);

  @Route({
    method: 'GET',
    path: '/linear-regression/{symbol}'
  })
  public static getLinearRegressionForSymbolAndPeriod(request, reply) {
    let limit = parseInt(request.query.limit, 10);
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
    let response = reply(LinearRegressionResource.linearRegressionService
      .getLinearRegression(symbol, limit).then(result => {
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
