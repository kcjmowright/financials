import {knex} from '../db';
import {PageRequest, PageResults} from '../../shared';
import Route from '../route.decorator';

export class IncomeStatementResource {

  /**
   *
   * @param request
   * @param reply
   */
  @Route({
    path: '/income-statement',
    method: 'GET'
  })
  public static findIncomeStatements(request, reply): void {
    let symbol = request.query.symbol;
    let page = PageRequest.newPageRequest(request.query);
    let queryBuilder = knex('incomestatements').select('*');
    let countQuery = knex('incomestatements').count('id');

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
          })
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
    path: '/income-statement/{id}',
    method: 'GET'
  })
  public static getIncomeStatement(request, reply): void {
    let id = parseInt(request.params.id);

    if(isNaN(id) || id <= 0) {
      reply({
        message: `Malformed request, ID is not valid.`
      }).type('application/json').code(400);
      return;
    }
    let response = reply(knex('incomestatements')
      .where({
        id: +id
      })
      .select('*')
      .then((result) => {
        if(!result.length) {
          response.code(404);
          return {
            message: `Income statement not found.`
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
