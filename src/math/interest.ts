export class Interest {

  /**
   * Future value less principal.
   *
   * @param {number} principal the initial amount.
   * @param {number} rate percentage rate represented as a decimal value.
   * @param {number} timesPerYear frequency of compounding per year.
   * @param {number} years number of years
   * @return {number} The compounded interest
   */
  public static compounded(principal: number, rate: number, timesPerYear: number, years: number) : number {
    return Interest.futureValue(principal, rate, timesPerYear, years) - principal;
  }

  /**
   *
   * @param {number} principal the initial amount.
   * @param {number} rate percentage rate represented as a decimal value.
   * @param {number} timesPerYear frequency of compounding per year.
   * @param {number} years number of years
   * @return {number} The future value.
   */
  public static futureValue(principal: number, rate: number, timesPerYear: number, years: number) : number {
    return principal * Math.pow((1 + (rate / timesPerYear)), (timesPerYear * years));
  }
}
