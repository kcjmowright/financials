import * as _ from 'lodash';

import {Fundamentals} from '../company/fundamentals';
import {ForecastPeriod} from './forecast-period';

/**
 *
 * http://www.investopedia.com/university/dcf/
 */
export class DiscountedCashFlow {

  /**
   * Discounted cash flows for the given financials and forecast periods.
   */
  public discountedCashFlowValues: number[];

  /**
   *
   * @param {Fundamentals} financialStatement
   * @param {ForecastPeriod[]|ForecastPeriod} forecastPeriods
   */
  constructor(fundamentals: Fundamentals, forecastPeriods: ForecastPeriod | ForecastPeriod[],
              targetNetInvestmentPercentage: number, targetOperatingCostsPercentage: number) {
    let taxRate = fundamentals.taxRate();
    let discountRate = DiscountedCashFlow.discountRate(fundamentals.equity, fundamentals.getDebt(),
      fundamentals.calculateCostOfEquityCapitalAssetPricingModel(),
      fundamentals.simplifiedCostOfDebt(), taxRate);

    if(!Array.isArray(forecastPeriods)) {
      forecastPeriods = [ forecastPeriods ];
    }

    this.discountedCashFlowValues = forecastPeriods.map(forecastPeriod => {
      let forecastedOperatingCosts = forecastPeriod.forecastOperatingCosts(fundamentals.operatingCostsPercentage(), targetOperatingCostsPercentage);
      let forecastedNetInvestments = forecastPeriod.forecastNetInvestments(fundamentals.netInvestmentPercentage(), targetNetInvestmentPercentage);
      let forecastedChangeInWorkingCapitals = forecastPeriod.forecastChangeInWorkingCapital(fundamentals.workingCapital(), forecastPeriod.growthRates);

      let freeCashFlows = forecastPeriod.revenues.map((revenue, index) => {
        let operatingCosts = forecastedOperatingCosts[index];
        let taxes = ( revenue - operatingCosts ) * taxRate;
        let netInvestment = forecastedNetInvestments[index];
        let changeInWorkingCapital = forecastedChangeInWorkingCapitals[index];

        return DiscountedCashFlow.freeCashFlow(revenue, operatingCosts, taxes, netInvestment, changeInWorkingCapital);
      });

      let terminalValue = DiscountedCashFlow.terminalValue(_.last(freeCashFlows), forecastPeriod.longTermCashFlowGrowthRate, discountRate);
      let enterpriseValue = DiscountedCashFlow.enterpriseValue(freeCashFlows, terminalValue, discountRate);
      let fairValue = DiscountedCashFlow.fairValue(enterpriseValue, fundamentals.getDebt());

      return DiscountedCashFlow.fairValuePerShare(fairValue, fundamentals.outstandingShares);
    });

  }

  /**
   * Discount Rate Using (WACC) Weighted Average Cost Of Capital
   *
   * The weighted average cost of capital (WACC) is the rate that a company is expected to pay on average to all its security holders to finance its assets. The WACC is commonly referred to as the firm's cost of capital. Generally speaking, a company's assets are financed by debt and equity. WACC is the average of the costs of these sources of financing, each of which is weighted by its respective use in the given situation. By taking a weighted average, we can see how much interest the company has to pay for every dollar it finances.

   WACC	=	E	/	(E + D)	*	Cost of Equity	+	D	/	(E + D)	*	Cost of Debt	*	(1 - Tax Rate)
   1. Weights:
   Generally speaking, a company's assets are financed by debt and equity. We need to calculate the weight of equity and the weight of debt.
   The market value of equity (E) is also called "Market Cap". As of today, NVIDIA Corp's market capitalization (E) is $81897.460 Mil.
   The market value of debt is typically difficult to calculate, therefore, GuruFocus uses book value of debt (D) to do the calculation. It is simplified by adding the latest two-year average Short-Term Debt and Long-Term Debt together. As of Jan. 2017, NVIDIA Corp's latest two-year average Short-Term Debt was $1104.5 Mil and its latest two-year average Long-Term Debt was $999.5 Mil. The total Book Value of Debt (D) is $2104 Mil.
   a) weight of equity = E / (E + D) = 81897.460 / (81897.460 + 2104) = 0.975
   b) weight of debt = D / (E + D) = 2104 / (81897.460 + 2104) = 0.025

   2. Cost of Equity:
   GuruFocus uses Capital Asset Pricing Model (CAPM) to calculate the required rate of return. The formula is:
   Cost of Equity = Risk-Free Rate of Return + Beta of Asset * (Expected Return of the Market - Risk-Free Rate of Return)
   a) GuruFocus uses 10-Year Treasury Constant Maturity Rate as the risk-free rate. It is updated daily. The current risk-free rate is 2.23000000%. Please go to Economic Indicators page for more information.
   b) Beta is the sensitivity of the expected excess asset returns to the expected excess market returns. NVIDIA Corp's beta is 1.48.
   c) (Expected Return of the Market - Risk-Free Rate of Return) is also called market premium. GuruFocus requires market premium to be 6%.
   Cost of Equity = 2.23000000% + 1.48 * 6% = 11.11%
   3. Cost of Debt:
   GuruFocus uses last fiscal year end Interest Expense divided by the latest two-year average debt to get the simplified cost of debt.
   As of Jan. 2017, NVIDIA Corp's interest expense (positive number) was $58 Mil. Its total Book Value of Debt (D) is $2104 Mil.
   Cost of Debt = 58 / 2104 = 2.7567%.

   4. Multiply by one minus Average Tax Rate:
   GuruFocus uses the latest two-year average tax rate to do the calculation.
   The latest Two-year Average Tax Rate is 14.955%.
   NVIDIA Corp's Weighted Average Cost Of Capital (WACC) for Today is calculated as:

   WACC	=	E / (E + D)	*	Cost of Equity	+	D / (E + D)	*	Cost of Debt	*	(1 - Tax Rate)
   =	0.975	*	11.11%	+	0.025	*	2.7567%	*	(1 - 14.955%)
   =	10.89%
   * All numbers are in millions except for per share data and ratio. All numbers are in their local exchange's currency.

   Explanation
   Because it costs money to raise capital. A firm that generates higher returns on investment than it costs the company to raise the capital needed for that investment is earning excess returns. A firm that expects to continue generating positive excess returns on new investments in the future will see its value increase as growth increases, whereas a firm that earns returns that do not match up to its cost of capital will destroy value as it grows.

   As of today, NVIDIA Corp's weighted average cost of capital is 10.89%. NVIDIA Corp's return on invested capital is 73.13% (calculated using TTM income statement data). NVIDIA Corp generates higher returns on investment than it costs the company to raise the capital needed for that investment. It is earning excess returns. A firm that expects to continue generating positive excess returns on new investments in the future will see its value increase as growth increases.

   Be Aware
   1. GuruFocus uses book value of debt (D) to do the calculation. It is simplified by adding latest two-year average Short-Term Debt and Long-Term Debt together.

   2. The WACC formula discussed above does not include Preferred Stock. Please adjust if preferred stock is considered.

   3. (Expected Return of the Market - Risk-Free Rate of Return) is also called market premium. GuruFocus requires market premium to be 6%.

   4. GuruFocus uses last fiscal year end Interest Expense divided by the latest two-year average debt to get the simplified cost of debt.

   Related Terms
   Market Cap, Interest Expense, Short-Term Debt, Long-Term Debt

   Historical Data
   * All numbers are in millions except for per share data and ratio. All numbers are in their local exchange's currency.

   NVIDIA Corp Annual Data

   Jan08	Jan09	Jan10	Jan11	Jan12	Jan13	Jan14	Jan15	Jan16	Jan17
   WACC	21.89	14.02	12.95	12.85	11.01	11.85	10.08	9.09	7.78	12.53
   NVIDIA Corp Quarterly Data

   Jan15	Apr15	Jul15	Oct15	Jan16	Apr16	Jul16	Oct16	Jan17	Apr17
   WACC	9.09	9.92	10.71	7.04	7.78	8.21	9.23	10.43	12.53	0.00
   *
   * @param {number} equity
   * @param {number} debt
   * @param {number} costOfEquity percentage rate as a decimal
   * @param {number} costOfDebt percentage rate as a decimal
   * @param {number} taxRate percentage rate as a decimal
   * @return {number}
   */
  public static discountRate(equity: number, debt: number, costOfEquity: number, costOfDebt: number, taxRate: number): number {
    let value = equity + debt;

    return equity / value * costOfEquity + debt / value * costOfDebt * ( 1 - taxRate);
  }

  /**
   *
   * @param {number} revenue
   * @param {number} operatingCosts Future operating costs
   * @param {number} taxes
   * @param {number} netInvestment
   * @param {number} changeInWorkingCapital Change in working capital.
   * @return {number}
   */
  public static freeCashFlow(revenue: number, operatingCosts: number, taxes: number, netInvestment: number, changeInWorkingCapital: number) {
    return revenue - operatingCosts - taxes - netInvestment - changeInWorkingCapital;
  }

  /**
   * Gordon Growth Model
   *
   * @param {number} finalProjectYearCashFlow
   * @param {number} longTermCashFlowGrowthRate percentage as a decimal value.
   * @param {number} discountRate percentage as a decimal value.
   * @return {number}
   */
  public static terminalValue(finalProjectYearCashFlow: number, longTermCashFlowGrowthRate: number, discountRate: number): number {
    return (finalProjectYearCashFlow * (1 + longTermCashFlowGrowthRate)) / (discountRate - longTermCashFlowGrowthRate);
  }

  /**
   *
   * @param {number} freeCashFlow
   * @param {number} terminalValue
   * @param {number} discountRate
   * @return {number}
   */
  public static enterpriseValue(freeCashFlow: number[], terminalValue: number, discountRate: number): number {
    let ev = freeCashFlow.reduce((acc, val, idx) => acc += val / Math.pow(1 + discountRate, (idx + 1)), 0);

    ev += terminalValue / Math.pow(1 + discountRate, freeCashFlow.length);
    return ev;
  }

  /**
   *
   * @param {number} enterpriseValue
   * @param {number} debt
   * @return {number}
   */
  public static fairValue(enterpriseValue: number, debt: number): number {
    return enterpriseValue - debt;
  }

  /**
   *
   * @param fairValue
   * @param outstandingShares
   * @return {number}
   */
  public static fairValuePerShare(fairValue: number, outstandingShares: number): number {
    return fairValue / outstandingShares;
  }
}
