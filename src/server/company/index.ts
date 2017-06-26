import {CompanyResource} from './company-resource';
import {FundamentalsResource} from './fundamentals-resource';
import {QuoteResource} from './quote-resource';
import {ServerRegistrations} from '../server-registrations';

/**
 *
 * @param server
 * @param options
 * @param next
 */
export function register(server, options, next): void {
  ServerRegistrations.register('company', server, [
    CompanyResource,
    FundamentalsResource,
    QuoteResource
  ]);
  next();
}

export namespace register {
  export const attributes = {
    name: 'company',
    version: '1.0.0'
  }
}
