import {knex} from '../db';
import {Company} from '../../company';
import {PageRequest, PageResults} from '../../shared';
import {NasdaqCompaniesStream} from '../feeds';
import {Promise} from 'bluebird';
import Route from '../route.decorator';

export class CompanyResource {

  /**
   *
   * @param request
   * @param reply
   * @return {Response}
   */
  @Route({
    method: 'GET',
    path: '/company'
  })
  public static findCompanies(request, reply): void {
    let name = request.query.name;
    let page = PageRequest.newPageRequest(request.query);
    let queryBuilder = knex('companies')
      .select('id', 'name', 'ticker', 'industry', 'sector', 'exchange')
      .limit(page.pageSize)
      .offset(page.getOffset())
      .orderBy('name');
    let countQueryBuilder = knex('companies').count('name');

    if(!!name) {
      queryBuilder = queryBuilder.whereRaw('name like ?', [`%${name}%`]);
      countQueryBuilder = countQueryBuilder.whereRaw('name like ?', [`%${name}%`]);
    }
    let response = reply(queryBuilder
      .then(
        (results) => {
          return countQueryBuilder.then(
            (r) => new PageResults(results, +r[0].count, page.page, page.pageSize),
            (e) => {
              console.log(e);
              response.code(500);
              return {
                message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
              };
            }
          );
        },
        (e) => {
          console.log(e);
          response.code(500);
          return {
            message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
          };
        }
      )).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   * @return {Response}
   */
  @Route({
    method: 'GET',
    path: '/company/{id}'
  })
  public static getCompany(request, reply): void {
    let id = parseInt(request.params.id);

    if(isNaN(id) || id <= 0) {
      reply({
        message: `Malformed request id, value is not valid.`
      }).code(400);
      return;
    }

    let response = reply(knex('companies')
      .where({
        id: id
      })
      .select('id', 'name', 'ticker', 'sector', 'industry', 'exchange')
      .then((resp) => {
        if(!resp.length) {
          response.code(404);
          return {
            message: `Company not found.`
          };
        }
        return resp[0];
      }, (e) => {
        console.log(e);
        response.code(500);
        return {
          message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
        };
      }
    )).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   * @return {Response}
   */
  @Route({
    method: 'GET',
    path: '/company/ticker/{ticker}'
  })
  public static getCompanyByTicker(request, reply): void {
    let ticker = request.params.ticker;

    let response = reply(knex('companies')
      .where({
        ticker: ticker.toUpperCase()
      })
      .select('id', 'name', 'ticker', 'sector', 'industry', 'exchange')
      .then((resp) => {
          if(!resp.length) {
            response.code(404);
            return {
              message: `Company not found.`
            };
          }
          return resp[0];
        }, (e) => {
          console.log(e);
          response.code(500);
          return {
            message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
          };
        }
      )).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   * @return {Response}
   */
  @Route({
    method: 'POST',
    path: '/company'
  })
  public static createCompany(request, reply): void {
    let company = Company.newInstance(request.payload);
    let response = reply(knex('companies')
      .returning('id')
      .insert({
        name: company.name,
        ticker: !!company.ticker ? company.ticker.toUpperCase() : null,
        sector: company.sector,
        industry: company.industry,
        exchange: company.exchange
      })
      .then((resp) => {
        company.id = resp[0];
        return company;
      }, (e) => {
        console.log(e);
        response.code(500);
        return {
          message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
        };
      }
    )).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
   * @return {any}
   */
  @Route({
    method: 'PUT',
    path: '/company'
  })
  public static updateCompany(request, reply): void {
    let company = Company.newInstance(request.payload);

    if(!company.id || isNaN(company.id) || company.id <= 0) {
      reply({
        message: `Malformed request: Can NOT update company without company ID.`
      }).code(400).type('application/json');
      return;
    }

    let response = reply(knex('companies')
      .where({
        id: company.id
      })
      .update({
        name: company.name,
        ticker: !!company.ticker ? company.ticker.toUpperCase() : null,
        sector: company.sector,
        industry: company.industry,
        exchange: company.exchange
      })
      .then(() => {
        response.code(204);
      }, (e) => {
        console.log(e);
        response.code(500);
        return {
          message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
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
    method: 'DELETE',
    path: '/company/{id}'
  })
  public static removeCompany(request, reply): void {
    let id = parseInt(request.params.id);

    if (isNaN(id) || id <= 0) {
      reply({
        message: `Malformed request, id is not valid.`
      }).type('application/json').code(400);
      return;
    }

    let response = reply(knex('company')
      .where({
        id: id
      })
      .del()
      .then(() => {
        response.code(204);
      }, (e) => {
        console.log(e);
        response.code(500);
        return {
          message: `Error: ${!!e.detail ? e.detail : e.message}.  See log for details.`
        };
      }
    ));
  }

  /**
   *
   * @param request
   * @param reply
   */
  @Route({
    method: 'PUT',
    path: '/company/populate'
  })
  public static populateCompanies(request, reply) {
    let nasdaq = new Promise((resolve, reject) => {
      new NasdaqCompaniesStream('NASDAQ', knex).get((e) => {
        if(!!e) {
          reject(e);
          return;
        }
        resolve();
      });
    });
    let nyse = new Promise((resolve, reject) => {
      new NasdaqCompaniesStream('NYSE', knex).get((e) => {
        if(!!e) {
          reject(e);
          return;
        }
        resolve();
      });
    });
    let amex = new Promise((resolve, reject) => {
      new NasdaqCompaniesStream('AMEX', knex).get((e) => {
        if(!!e) {
          reject(e);
          return;
        }
        resolve();
      });
    });
    let response = reply(Promise.all([
      nasdaq,
      amex,
      nyse
    ]).then(() => {
      response.code(204);
    }, (e) => {
      console.log(e);
      response.code(500);
      return {
        message: `Error populating companies: ${e.message}`
      };
    })).type('application/json');
  }
}
