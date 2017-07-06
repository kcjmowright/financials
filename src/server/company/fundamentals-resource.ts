import {knex} from '../db';
import Route from '../route.decorator';
import {GoogleFinanceFinancialsService} from '../feeds';

export class FundamentalsResource {

  /**
   *
   * @param request
   * @param reply
   */
  @Route({
    path: '/fundamentals',
    method: 'PUT'
  })
  public static populateFundamentals(request, reply) {
    new GoogleFinanceFinancialsService(knex).fetchFinancials();
    reply().code(204);
  }

}
