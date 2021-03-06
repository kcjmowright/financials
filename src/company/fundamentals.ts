import {Company} from './company';
import {average} from '../math';

/**
 * Values are assumed to be in millions
 */
export class Fundamentals {

  id?: number;

  /**
   * Total Assets : Found on Balance Sheet
   */
  assets: number;

  /**
   * Beta ( 5 Yr )
   * Beta is a measure of risk calculated as a regression on the company's stock price.
   */
  beta: number;

  /**
   * Capital Expenditures : Found on Cash Flow
   */
  capitalExpenditure: number;

  /**
   * Changes In Working Capital : Found on Cash Flow
   */
  changesInWorkingCapital: number;

  /**
   * Company name and ticker
   */
  company: Company;

  /**
   * Total Debt : Found on Balance Sheet
   */
  debt: number | number[];

  /**
   * Total Equity : Found on Balance Sheet
   */
  equity: number;

  /**
   * Income Before Tax : Found on Income Statement
   */
  incomePreTax: number;

  /**
   * Income Tax Total : Found on Income Statement
   */
  incomeTaxTotal: number | number[];

  /**
   *
   */
  interestExpense: number;

  /**
   * Total Liabilities : Found on Balance Sheet
   */
  liabilities: number;

  /**
   * Net Income : Found on Income Statement
   *
   */
  netIncome: number;

  /**
   * Net Sales : ??
   *
   * Net sales are the amount of sales generated by a company after the deduction of returns,
   * allowances for damaged or missing goods and any discounts allowed.
   * The sales number reported on a company's financial statements is a net sales number, reflecting these deductions.
   */
  netSales: number;

  /**
   * Depreciation/Depletion : Found on Cash Flow ???
   */
  nonCashDepreciation: number;

  /**
   *
   */
  outstandingShares: number;

  /**
   * Total Revenue : Found on Income Statement
   */
  revenue: number;

  /**
   * Average debt
   * @return {number}
   */
  public getDebt(): number {
    let debts = this.debt;

    if(!Array.isArray(debts)) {
      debts = [ debts ];
    }
    return average(debts);
  }

  /**
   * Average income tax
   * @return {number}
   */
  public getIncomeTax(): number {
    let taxes = this.incomeTaxTotal;

    if(!Array.isArray(taxes)) {
      taxes = [ taxes ];
    }
    return average(taxes);
  }

  /**
   * To calculate the net investment, we take capital expenditure (found in the company’s statement of cash flows)
   * and subtract non-cash depreciation (found on the income statement).
   *
   * @return {number}
   */
  public netInvestment(): number {
    return this.capitalExpenditure - this.nonCashDepreciation;
  }

  /**
   *
   * @return {number}
   */
  public netInvestmentPercentage(): number {
    return this.netInvestment() / this.revenue;
  }

  /**
   * If you can’t find a company’s operating costs on its income statement, you can calculate it by subtracting net operating profits
   * (or earnings before interest and taxation – EBIT) from total revenues.
   *
   * @return {number}
   */
  public operatingCosts(): number {
    return this.revenue - this.netIncome;
  }

  /**
   * To forecast future operating costs, it can be helpful to look at a company’s historical operating margins,
   * a figure expressed as a percentage, and calculated by taking operating income and dividing it by net sales.
   *
   * @return {number}
   */
  public operatingCostsPercentage(): number {
    return this.operatingCosts() / this.netSales;
  }

  /**
   * Since many companies don’t actually pay the official corporate tax rate on their operating profits,
   * you calculate the tax rate by taking the average annual income tax paid over the past few years, divided by pre-tax profits.
   *
   * @return {number}
   */
  public taxRate(): number {
    return this.getIncomeTax() / this.incomePreTax;
  }

  /**
   * To calculate working capital, we take current assets and subtract current liabilities.
   * You can find both of these on a company’s balance sheet,
   * which is published in its quarterly and annual financial statements.
   * @return {number}
   */
  public workingCapital(): number {
    return this.assets - this.liabilities;
  }

  /**
   * CAPM Formula
   * The CAPM formula is: Cost of Equity = Risk-Free Rate of Return + Beta * (Market Rate of Return - Risk-Free Rate of Return).
   *
   * - In this equation, the risk-free rate is the rate of return paid on risk-free investments such as Treasuries.
   * - Beta is a measure of risk calculated as a regression on the company's stock price.
   * The higher the volatility, the higher the beta and relative risk compared to the general market.
   * The market rate of return is the average market rate, which has generally been assumed to be 11 to 12% over the past 80 years.
   * In general, a company with a high beta, that is, a company with a high degree of risk, is going to pay more to obtain equity.
   */
  public calculateCostOfEquityCapitalAssetPricingModel(riskFreeRate: number = 0.025, marketRateOfReturn: number = 0.06): number {
    // ( Risk-Free Rate of Return + Beta ) * (Market Rate of Return - Risk-Free Rate of Return).
    return ( riskFreeRate + this.beta ) * ( marketRateOfReturn - riskFreeRate );
  }

  /**
   * Cost of Debt
   * after-tax cost of debt (there is a tax shield associated with interest).
   * @return {number}
   */
  // public calculateCostOfDebt(riskFreeRate: number = 0.025, creditSpread: number = 0.03): number {
  //   // ( Risk-Free Rate of Return + credit spread ) * ( 1 - effective tax rate )
  //   // ( rf + creditSpread ) * ( 1 - taxRate )
  //   //  Before tax       After tax
  //   //        v              v
  //   // ( 0.02 + 0.03 ) * ( 1 - 0.35 )
  //   return ( riskFreeRate + creditSpread) * ( 1 - this.taxRate() );
  // }

  /**
   * Cost of Debt:
    Last fiscal year end Interest Expense divided by the latest two-year average debt to get the simplified cost of debt.
   As of Jan. 2017, NVIDIA Corp's interest expense (positive number) was $58 Mil. Its total Book Value of Debt (D) is $2104 Mil.
   Cost of Debt = 58 / 2104 = 2.7567%.
   */
  public simplifiedCostOfDebt(): number {
    return this.interestExpense / this.getDebt();
  }
}
