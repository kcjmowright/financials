import {knex} from '../db';
import {Company} from '../../company';
import {CompanyService} from './company-service';
import {PageRequest} from '../../shared';
import {Promise} from 'bluebird';
import Route from '../route.decorator';

/**
 *
 */
export class CompanyResource {

  static companyService = new CompanyService(knex);

  /**
   *
   * @param request
   * @param reply
   */
  @Route({
    method: 'GET',
    path: '/company'
  })
  public static findCompanies(request, reply): void {
    let name = request.query.name;
    let page = PageRequest.newPageRequest(request.query);
    let response = reply(CompanyResource.companyService.findCompanies(page, name).catch(
      e => {
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
    method: 'GET',
    path: '/company/{id}'
  })
  public static getCompany(request, reply): void {
    let id = parseInt(request.params.id, 10);

    if(isNaN(id) || id <= 0) {
      reply({
        message: `Malformed request id, value is not valid.`
      }).code(400);
      return;
    }
    let response = reply(CompanyResource.companyService.getCompany(id).then(result => {
        if(!result) {
          response.code(404);
          return {
            message: `Company not found.`
          };
        }
        return result;
      }, e => {
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
    method: 'GET',
    path: '/company/ticker/{ticker}'
  })
  public static getCompanyByTicker(request, reply): void {
    let ticker = request.params.ticker;

    if(!ticker) {
      reply({
        message: `Expected ticker symbol.`
      }).code(400);
      return;
    }
    let response = reply(CompanyResource.companyService.getCompanyByTicker(ticker).then((resp) => {
        if(!resp) {
          response.code(404);
          return {
            message: `Company not found.`
          };
        }
        return resp;
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
    method: 'POST',
    path: '/company'
  })
  public static createCompany(request, reply): void {
    let company = Company.newInstance(request.payload);
    let response = reply(CompanyResource.companyService.createCompany(company).catch(e => {
      console.log(e);
      response.code(500);
      return {
        message: `${!!e.detail ? e.detail : e.message}.  See log for details.`
      };
    })).type('application/json');
  }

  /**
   *
   * @param request
   * @param reply
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
    let response = reply(CompanyResource.companyService.updateCompany(company)
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
    let id = parseInt(request.params.id, 10);

    if (isNaN(id) || id <= 0) {
      reply({
        message: `Malformed request, id is not valid.`
      }).type('application/json').code(400);
      return;
    }

    let response = reply(CompanyResource.companyService.removeCompany(id)
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
    let response = reply(CompanyResource.companyService.populateCompanies().then(() => {
      response.code(204);
    }, e => {
      console.log(e);
      response.code(500);
      return {
        message: `Error populating companies: ${e.message}`
      };
    })).type('application/json');
  }
}
