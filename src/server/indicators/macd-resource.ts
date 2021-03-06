import {knex} from '../db';
import {DateUtil} from '../../shared';
import {MacdService} from './macd-service';
import {MovingAverageConvergenceDivergence} from '../../indicators';
import Route from '../route.decorator';

/**
 *
 */
export class MacdResource {

  public static macdService = new MacdService(knex);

  @Route({
    method: 'GET',
    path: '/macd/{symbol}'
  })
  public static getMacdForSymbol(request, reply) {
    let limit = parseInt(request.query.limit, 10);
    let longPeriod = parseInt(request.query.longPeriod, 10);
    let shortPeriod = parseInt(request.query.shortPeriod, 10);
    let signalPeriod = parseInt(request.query.signalPeriod, 10);
    let symbol = request.params.symbol;

    if(!symbol) {
      reply({
        message: `Malformed request, ticker symbol is not valid.`
      }).code(400).type('application/json');
      return;
    }
    if(isNaN(limit) || limit <= 0 || limit > 260) {
      limit = 260;
    }
    if(isNaN(longPeriod) || longPeriod <= 0) {
      longPeriod = 26;
    }
    if(isNaN(shortPeriod) || shortPeriod <= 0) {
      shortPeriod = 12;
    }
    if(isNaN(signalPeriod) || signalPeriod <= 0) {
      signalPeriod = 9;
    }
    let response = reply(MacdResource.macdService.getMacdForSymbol(symbol, longPeriod, shortPeriod, signalPeriod, limit).then(result => {
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

  @Route({
    method: 'GET',
    path: '/macd/{symbol}.csv'
  })
  public static getMacdForSymbolCSV(request, reply) {
    let limit = parseInt(request.query.limit, 10);
    let longPeriod = parseInt(request.query.longPeriod, 10);
    let shortPeriod = parseInt(request.query.shortPeriod, 10);
    let signalPeriod = parseInt(request.query.signalPeriod, 10);
    let symbol = request.params.symbol;

    if(!symbol) {
      reply({
        message: `Malformed request, ticker symbol is not valid.`
      }).code(400).type('application/json');
      return;
    }
    if(isNaN(limit) || limit <= 0 || limit > 260) {
      limit = 260;
    }
    if(isNaN(longPeriod) || longPeriod <= 0) {
      longPeriod = 26;
    }
    if(isNaN(shortPeriod) || shortPeriod <= 0) {
      shortPeriod = 12;
    }
    if(isNaN(signalPeriod) || signalPeriod <= 0) {
      signalPeriod = 9;
    }
    let response = reply(MacdResource.macdService.getMacdForSymbol(symbol, longPeriod, shortPeriod, signalPeriod, limit)
      .then((result: MovingAverageConvergenceDivergence) => {
        if(!result) {
          response.code(404);
          return 'Ticker symbol not found.';
        }
        return result.results.map(v => {
          return `"${DateUtil.toISODateString(v.date)}", ${v.macdSlope}, ${v.macd}, ${v.distance}, ${v.histogram}, ${v.longEMA}, ${v.shortEMA}, ${v.signal}, ${v.value}, ${v.valueSlope}\n`;
        }).join('');
      }, e => {
        response.code(500);
        return `${!!e.detail ? e.detail : e.message}.  See log for details.`;
      })).type('text/csv');
  }
}
