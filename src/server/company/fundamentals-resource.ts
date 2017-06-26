import {knex} from '../db';
import {Company, Fundamentals} from '../../company';
import {PageRequest, PageResults} from '../../shared';
import register from '../server-register.decorator';

export class FundamentalsResource {

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/fundamentals',
    method: 'GET'
  })
  public static findFundamentals(request, reply): void {
    let page = PageRequest.clone(request.query);
    let response = reply(knex('fundamentals')
      .select('*')
      // .select('id', 'companyId', 'assets', 'beta', 'capitalExpenditure', 'changesInWorkingCapital',
      //   'debt', 'equity', 'incomePreTax', 'incomeTaxTotal', 'interestExpense', 'liabilities',
      //   'netIncome', 'netSales', 'nonCashDepreciation', 'outstandingShares')
      .leftJoin('companies', 'fundamentals.companyId', 'companies.id')
      .offset(page.getOffset())
      .limit(page.pageSize)
      .orderBy('companyName')
      .then(
        (results) => {
          let list = results.map((r) => {
            console.log(JSON.stringify(r));
            let fundamentals = new Fundamentals();

            fundamentals.company = new Company();
            fundamentals.company.id = r.companyId;
            fundamentals.assets = r.assets;
            fundamentals.beta = r.beta;
            fundamentals.capitalExpenditure = r.capitalExpenditure;
            fundamentals.changesInWorkingCapital = r.changesInWorkingCapital;
            fundamentals.debt = r.debt;
            fundamentals.equity = r.equity;
            fundamentals.incomePreTax = r.incomePreTax;
            fundamentals.interestExpense = r.interestExpense;
            fundamentals.liabilities = r.liabilities;
            fundamentals.netIncome = r.netIncome;
            fundamentals.netSales = r.netSales;
            fundamentals.nonCashDepreciation = r.nonCashDepreciation;
            fundamentals.outstandingShares = r.outstandingShares;
            return fundamentals;
          });
          knex('fundamentals').count('id').then((r) => {
            let pageResults = new PageResults(list, r[0].count, page.page, page.pageSize);

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
    path: '/fundamentals/{id}',
    method: 'GET'
  })
  public static getFundamentals(request, reply): void {
    let id = request.params.id;

    if(isNaN(+id)) {
      reply(JSON.stringify({
        message: `Malformed request, id is not valid.`
      })).code(400);
      return;
    }

    try {
      let response = reply(knex('fundamentals')
        .where({
          id: +id
        })
        .select('id', 'companyId', 'assets', 'beta', 'capitalExpenditure', 'changesInWorkingCapital',
          'debt', 'equity', 'incomePreTax', 'incomeTaxTotal', 'interestExpense', 'liabilities', 'netIncome', 'netSales',
          'nonCashDepreciation', 'outstandingShares')
        .then((result) => {
          if(!result.length) {
            response.code(404);
            return JSON.stringify({
              message: `Fundamentals not found.`
            });
          }
          let fundamentals = new Fundamentals();
          let r = result[0];

          fundamentals.company = new Company();
          fundamentals.company.id = r.companyId;
          fundamentals.assets = r.assets;
          fundamentals.beta = r.beta;
          fundamentals.capitalExpenditure = r.capitalExpenditure;
          fundamentals.changesInWorkingCapital = r.changesInWorkingCapital;
          fundamentals.debt = r.debt;
          fundamentals.equity = r.equity;
          fundamentals.incomePreTax = r.incomePreTax;
          fundamentals.interestExpense = r.interestExpense;
          fundamentals.liabilities = r.liabilities;
          fundamentals.netIncome = r.netIncome;
          fundamentals.netSales = r.netSales;
          fundamentals.nonCashDepreciation = r.nonCashDepreciation;
          fundamentals.outstandingShares = r.outstandingShares;
          return JSON.stringify(fundamentals);

        }, (e) => {
          console.log(e);
          response.code(500);
          return JSON.stringify({
            message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
          });
        })).type('application/json');
    } catch(e) {
      console.log(e);
      reply(JSON.stringify({
        message: `Failed to get fundamentals: ${e.message}`
      })).code(500);
    }
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/fundamentals/ticker/{ticker}',
    method: 'GET'
  })
  public static getFundamentalsByTicker(request, reply): void {
    let ticker = request.params.ticker;

    if(!ticker || typeof ticker !== 'string') {
      reply(JSON.stringify({
        message: `Malformed request.  Ticker value is not valid.`
      })).code(400);
      return;
    }

    try {
      let response = reply(
        knex('company')
          .where({
            ticker: ticker
          })
          .select('id').then((results) => {
            knex('fundamentals')
              .where({
                companyId: results[0].id
              })
              .select('id', 'companyId', 'assets', 'beta', 'capitalExpenditure', 'changesInWorkingCapital',
                'debt', 'equity', 'incomePreTax', 'incomeTaxTotal', 'interestExpense', 'liabilities', 'netIncome', 'netSales',
                'nonCashDepreciation', 'outstandingShares')
              .then((result) => {
                if(!result.length) {
                  response.code(404);
                  return JSON.stringify({
                    message: `Fundamentals not found.`
                  });
                }
                let fundamentals = new Fundamentals();
                let r = result[0];

                fundamentals.company = new Company();
                fundamentals.company.id = r.companyId;
                fundamentals.assets = r.assets;
                fundamentals.beta = r.beta;
                fundamentals.capitalExpenditure = r.capitalExpenditure;
                fundamentals.changesInWorkingCapital = r.changesInWorkingCapital;
                fundamentals.debt = r.debt;
                fundamentals.equity = r.equity;
                fundamentals.incomePreTax = r.incomePreTax;
                fundamentals.interestExpense = r.interestExpense;
                fundamentals.liabilities = r.liabilities;
                fundamentals.netIncome = r.netIncome;
                fundamentals.netSales = r.netSales;
                fundamentals.nonCashDepreciation = r.nonCashDepreciation;
                fundamentals.outstandingShares = r.outstandingShares;
                return JSON.stringify(fundamentals);
              }, (e) => {
                console.log(e);
                response.code(500);
                return JSON.stringify({
                  message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
                });
              });
          }, (e) => {
            console.log(e);
            response.code(500);
            return JSON.stringify({
              message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
            });
          })
      ).type('application/json');
    } catch(e) {
      console.log(e);
      reply(JSON.stringify({
        message: `Failed to get fundamentals: ${e.message}`
      })).code(500);
    }
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/fundamentals',
    method: 'POST'
  })
  public static createFundamentals(request, reply): void {
    let fundamentals: Fundamentals = request.payload;
    let response = reply(knex('fundamentals').returning('id').insert({
      companyId: fundamentals.company.id,
      assets: fundamentals.assets,
      beta: fundamentals.beta,
      capitalExpenditure: fundamentals.capitalExpenditure,
      changesInWorkingCapital: fundamentals.changesInWorkingCapital,
      debt: fundamentals.debt,
      equity: fundamentals.equity,
      incomePreTax: fundamentals.incomePreTax,
      interestExpense: fundamentals.interestExpense,
      liabilities: fundamentals.liabilities,
      netIncome: fundamentals.netIncome,
      netSales: fundamentals.netSales,
      nonCashDepreciation: fundamentals.nonCashDepreciation,
      outstandingShares: fundamentals.outstandingShares
    }).then((resp) => {
      fundamentals.id = resp[0];
      return JSON.stringify(fundamentals);
    }, (e) => {
      console.log(e);
      response.code(500);
      return JSON.stringify({
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      });
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/fundamentals',
    method: 'PUT'
  })
  public static updateFundamentals(request, reply): void {
    let fundamentals: Fundamentals = request.payload;

    if(!fundamentals.id || isNaN(fundamentals.id)) {
      reply(JSON.stringify({
        message: `Malformed request, id is invalid`
      })).code(400);
      return;
    }
    let response = reply(knex('fundamentals').where({
      id: fundamentals.id
    }).update({
      companyId: fundamentals.company.id,
      assets: fundamentals.assets,
      beta: fundamentals.beta,
      capitalExpenditure: fundamentals.capitalExpenditure,
      changesInWorkingCapital: fundamentals.changesInWorkingCapital,
      debt: fundamentals.debt,
      equity: fundamentals.equity,
      incomePreTax: fundamentals.incomePreTax,
      interestExpense: fundamentals.interestExpense,
      liabilities: fundamentals.liabilities,
      netIncome: fundamentals.netIncome,
      netSales: fundamentals.netSales,
      nonCashDepreciation: fundamentals.nonCashDepreciation,
      outstandingShares: fundamentals.outstandingShares
    }).then(() => {
      response.code(204);
      return;
    }, (e) => {
      console.log(e);
      response.code(500);
      return JSON.stringify({
        message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
      });
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/fundamentals/{id}',
    method: 'DELETE'
  })
  public static removeFundamentals(request, reply): void {
    let id = request.params.id;

    if (isNaN(+id)) {
      reply(JSON.stringify({
        message: `Malformed request, id is invalid.`
      })).code(400);
      return;
    }
    let response = reply(knex('fundamentals').where({
      id: +id
    }).del().then(() => {
      response.code(204);
      return;
    }, (e) => {
      console.log(e);
      response.code(500);
      return JSON.stringify({
        message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
      });
    }));
  }

  /**
   *
   * @param request
   * @param reply
   */
  @register('company', {
    path: '/fundamentals/populate',
    method: 'PUT'
  })
  public static populateFundamentals(request, reply) {
    // const options = {
    //   host: 'api.usfundamentals.com',
    //   port: 443,
    //   path: this.path,
    //   method: 'GET'
    // };
    // const req = https.request(options, (res: https.IncomingMessage) => {
    //   this.onResponse(res, callback);
    // });
  }

}
