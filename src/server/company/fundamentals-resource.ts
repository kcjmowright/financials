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
    let svc = new GoogleFinanceFinancialsService(knex);

    svc.populateFinancials().then(() => console.log('Done populating financials.'),
      e => console.log(`Error populating financials: ${e.message}`));
    reply().code(204);
  }

}
