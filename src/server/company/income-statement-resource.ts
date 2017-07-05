import {knex} from '../db';
import {Company, Fundamentals} from '../../company';
import {PageRequest, PageResults} from '../../shared';
import register from '../server-register.decorator';
import {GoogleFinanceFinancialsService} from '../feeds';

export class IncomeStatementResource {

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
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
          return countQuery.then((r) => {
            let pageResults = new PageResults(results, r[0].count, page.page, page.pageSize);

            return JSON.stringify(pageResults);
          }, (e) => {
            console.log(e);
            response.code(500);
            return JSON.stringify({
              message: `${e.detail}.  See log for details.`
            });
          })
        },
        (e) => {
          console.log(e);
          response.code(500);
          return JSON.stringify({
            message: `${e.detail}.  See log for details.`
          });
        }
      )).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/income-statement/{id}',
    method: 'GET'
  })
  public static getIncomeStatement(request, reply): void {
    let id = request.params.id;

    let response = reply(knex('incomestatements')
      .where({
        id: +id
      })
      .select('*')
      .then((result) => {
        if(!result.length) {
          response.code(404);
          return JSON.stringify({
            message: `Income statement not found.`
          });
        }
        return JSON.stringify(result[0]);

      }, (e) => {
        console.log(e);
        response.code(500);
        return JSON.stringify({
          message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
        });
      })).type('application/json');
  }

}
