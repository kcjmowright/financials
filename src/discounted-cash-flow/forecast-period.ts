/**
 * http://www.investopedia.com/university/dcf/dcf1.asp
 *
 * - Slow-growing; operates in a highly competitive, low-margin industry => 1 Year
 * - Solid company; has advantages such as strong marketing channels, brand recognition and/or regulatory advantage => 5 years
 * - Outstanding growth; operates with high barriers to entry, dominant market position or prospects => 10 Years
 *
 */
export class ForecastPeriod {
  public revenues: number[];

  /**
   *
   * @param {number} revenue current revenue.
   * @param {number[]} growthRates yearly growth rates.
   * @param {number} [longTermCashFlowGrowthRate=0.04] long term projected cash flow growth rate.
   * @constructor
   */
  constructor(public revenue: number, public growthRates: number[], public longTermCashFlowGrowthRate: number = 0.04) {
    this.revenues = growthRates.map(growthRate => revenue = revenue * ( 1 + growthRate));
  }

  /**
   *
   * @param {number} netInvestmentPercentage current net investment percentage.
   * @param {number} targetNetInvestmentPercentage
   * @return {number[]}
   */
  public forecastNetInvestments(netInvestmentPercentage: number, targetNetInvestmentPercentage: number): number[] {
    let incrementBy = (targetNetInvestmentPercentage - netInvestmentPercentage) / this.revenues.length;

    return this.revenues.map((revenue, index) => {
      netInvestmentPercentage += incrementBy;
      /**
       * The last increment may not bring the netInvestmentPercentage to equal the targetNetInvestmentPercentage
       * if the number of increments does not cleanly divide the difference between the two.
       */
      if(index + 1 === this.revenues.length) {
        netInvestmentPercentage = targetNetInvestmentPercentage;
      }
      return revenue * netInvestmentPercentage;
    });
  }

  /**
   *
   * @param {number} operatingCostsPercentage
   * @param {number} targetOperatingCostsPercentage
   * @return {number[]}
   */
  public forecastOperatingCosts(operatingCostsPercentage: number, targetOperatingCostsPercentage: number): number[] {
    let incrementBy = (targetOperatingCostsPercentage - operatingCostsPercentage) / this.revenues.length;

    return this.revenues.map((revenue, index) => {
      operatingCostsPercentage += incrementBy;
      /**
       * The last increment may not bring the netInvestmentPercentage to equal the targetNetInvestmentPercentage
       * if the number of increments does not cleanly divide the difference between the two.
       */
      if(index + 1 === this.revenues.length) {
        operatingCostsPercentage = targetOperatingCostsPercentage;
      }
      return revenue * operatingCostsPercentage;
    });
  }

  /**
   *
   * @param workingCapital
   * @param workingCaptialGrowthRates
   * @return {number[]}
   */
  public forecastChangeInWorkingCapital(workingCapital: number, workingCapitalGrowthRates: number[]): number[] {
    return workingCapitalGrowthRates.map(growthRate => {
      let previous = workingCapital;

      workingCapital = previous * ( 1.0 + growthRate );
      return workingCapital - previous;
    });
  }

}
