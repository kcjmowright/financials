import {knex} from '../db';
import {PageRequest, PageResults} from '../../shared';
import Route from '../route.decorator';

export class CashFlowResource {

  /**
   *
   * @param request
   * @param reply
   */
  @Route({
    method: 'GET',
    path: '/cash-flow'
  })
  public static findCashFlows(request, reply): void {
    let symbol = request.query.symbol;
    let page = PageRequest.newPageRequest(request.query);
    let queryBuilder = knex('cashflows').select('*');
    let countQuery = knex('cashflows').count('id');

    if(!!symbol) {
      symbol = symbol.toUpperCase();
      queryBuilder = queryBuilder.where({
        symbol: symbol
      });
      countQuery = countQuery.where({
        symbol: symbol
      });
    }
    let response = reply(queryBuilder
      .offset(page.getOffset())
      .limit(page.pageSize)
      .orderBy('symbol')
      .then(
        (results) => {
          return countQuery.then((r) => new PageResults(results, r[0].count, page.page, page.pageSize), (e) => {
            console.log(e);
            response.code(500);
            return {
              message: `${e.detail}.  See log for details.`
            };
          });
        },
        (e) => {
          console.log(e);
          response.code(500);
          return {
            message: `${e.detail}.  See log for details.`
          };
        }
      )).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @Route({
    method: 'GET',
    path: '/cash-flow/{id}'
  })
  public static getCashFlow(request, reply): void {
    let id = parseInt(request.params.id, 10);

    if(isNaN(id) || id <= 0) {
      reply({
        message: `Malformed request, ID is not valid.`
      }).type('application/json').code(400);
      return;
    }
    let response = reply(knex('cashflows')
      .where({
        id: id
      })
      .select('*')
      .then((result) => {
        if(!result.length) {
          response.code(404);
          return {
            message: `Cash flow not found.`
          };
        }
        return result[0];

      }, (e) => {
        console.log(e);
        response.code(500);
        return {
          message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
        };
      })).type('application/json');
  }

}
