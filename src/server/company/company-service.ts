import * as Knex from 'knex';
import {Company} from '../../company';
import {NasdaqCompaniesStream} from '../feeds';
import {PageRequest, PageResults} from '../../shared';
import {Promise} from 'bluebird';

/**
 * Company service.
 */
export class CompanyService {

  /**
   * @param {Knex} knex db connection manager.
   * @constructor
   */
  constructor(private knex: Knex) {}

  /**
   *
   * @param {PageRequest} page
   * @param {string} name optional name or partial name filter.
   * @return {Promise<PageResults<Company>>}
   */
  public findCompanies(page: PageRequest = new PageRequest(), name?: string): Promise<PageResults<Company>> {
    if(page.sort !== 'name' && page.sort !== 'ticker') {
      page.sort = 'name';
    }
    let queryBuilder = this.knex('companies')
      .select('id', 'name', 'ticker', 'industry', 'sector', 'exchange')
      .limit(page.pageSize)
      .offset(page.getOffset())
      .orderBy(page.sort, page.dir);
    let countQueryBuilder = this.knex('companies').count('name');

    if(!!name) {
      queryBuilder = queryBuilder.whereRaw('name like ?', [`%${name}%`]);
      countQueryBuilder = countQueryBuilder.whereRaw('name like ?', [`%${name}%`]);
    }
    return queryBuilder.then(results => countQueryBuilder.then(r =>
      new PageResults(results, +r[0].count, page.page, page.pageSize, 'name', page.dir)));
  }

  /**
   *
   * @param {number} id company primary key.
   * @return {Promise<Company>}
   */
  public getCompany(id: number): Promise<Company> {
    if(isNaN(id) || id <= 0) {
      return Promise.reject(new Error(`Malformed request id, value is not valid.`));
    }
    return this.knex('companies')
      .where({
        id: id
      })
      .select('id', 'name', 'ticker', 'sector', 'industry', 'exchange')
      .then(resp => {
        if(!resp.length) {
          return null;
        }
        return resp[0];
      });
  }

  /**
   *
   * @param {string} ticker ticker symbol.
   * @return {Promise<Company>}
   */
  public getCompanyByTicker(ticker: string): Promise<Company> {
    if(!ticker) {
      return Promise.reject(new Error('Invalid ticker'));
    }
    return this.knex('companies')
      .where({
        ticker: ticker.toUpperCase()
      })
      .select('id', 'name', 'ticker', 'sector', 'industry', 'exchange')
      .then(resp => {
        if(!resp.length) {
          return null;
        }
        return resp[0];
      });
  }

  /**
   *
   * @param {Company} company a company.
   * @return {Promise<Company>}
   */
  public createCompany(company: Company): Promise<Company> {
    if(!company || !(company instanceof Company)) {
      return Promise.reject(new Error('Expected instance of company'));
    }
    return this.knex('companies')
      .returning('id')
      .insert({
        name: company.name,
        ticker: !!company.ticker ? company.ticker.toUpperCase() : null,
        sector: company.sector,
        industry: company.industry,
        exchange: company.exchange
      })
      .then(resp => {
        company.id = resp[0];
        return company;
      });
  }

  /**
   *
   * @param {Company} company
   * @return {Promise<void>}
   */
  public updateCompany(company: Company): Promise<void> {
    if(!company || !(company instanceof Company)) {
      return Promise.reject(new Error('Expected instance of company'));
    }
    if(isNaN(company.id) || company.id <= 0) {
      return Promise.reject(new Error(`Malformed request: Can NOT update company without company ID.`));
    }
    return this.knex('companies')
      .where({
        id: company.id
      })
      .update({
        name: company.name,
        ticker: !!company.ticker ? company.ticker.toUpperCase() : null,
        sector: company.sector,
        industry: company.industry,
        exchange: company.exchange
      });
  }

  /**
   *
   * @param {number} id
   * @return {Promise<void>}
   */
  public removeCompany(id: number): Promise<void> {
    if (isNaN(id) || id <= 0) {
      return Promise.reject(new Error(`Malformed request, id is not valid.`));
    }
    return this.knex('company').where({
      id: id
    }).del();
  }

  /**
   * Populates the company table with companies listed in the NASDAQ, NYSE and AMEX exchanges.
   * @return {Promise<void>}
   */
  public populateCompanies() {
    let nasdaq = new Promise((resolve, reject) => {
      new NasdaqCompaniesStream('NASDAQ', this.knex).get((e) => {
        if(!!e) {
          reject(e);
          return;
        }
        resolve();
      });
    });
    let nyse = new Promise((resolve, reject) => {
      new NasdaqCompaniesStream('NYSE', this.knex).get((e) => {
        if(!!e) {
          reject(e);
          return;
        }
        resolve();
      });
    });
    let amex = new Promise((resolve, reject) => {
      new NasdaqCompaniesStream('AMEX', this.knex).get((e) => {
        if(!!e) {
          reject(e);
          return;
        }
        resolve();
      });
    });
    return Promise.all([
      nasdaq,
      amex,
      nyse
    ]);
  }

}
