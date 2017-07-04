import {knex} from '../db';
import register from '../server-register.decorator';
import {GoogleFinanceFinancialsService} from '../feeds';

export class FundamentalsResource {

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/fundamentals',
    method: 'PUT'
  })
  public static populateFundamentals(request, reply) {
    new GoogleFinanceFinancialsService(knex).fetchFinancials();
    reply().code(204);
  }

}
