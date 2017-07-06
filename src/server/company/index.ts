import {BalanceSheetResource} from './balance-sheet-resource';
import {CashFlowResource} from './cash-flow-resource';
import {CompanyResource} from './company-resource';
import {FundamentalsResource} from './fundamentals-resource';
import {QuoteResource} from './quote-resource';
import {ServerRegistrations} from '../server-registrations';
import {IncomeStatementResource} from './income-statement-resource';

/**
 *
 * @param server
 * @param options
 * @param next
 */
export function register(server, options, next): void {
  ServerRegistrations.register(server, [
    BalanceSheetResource,
    CashFlowResource,
    CompanyResource,
    FundamentalsResource,
    IncomeStatementResource,
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
