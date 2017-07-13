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
    method: 'PUT',
    path: '/fundamentals'
  })
  public static populateFundamentals(request, reply) {
    new GoogleFinanceFinancialsService(knex).fetchFinancials();
    reply().code(204);
  }

}
