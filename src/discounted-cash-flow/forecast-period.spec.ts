import * as fs from 'fs';
import {ForecastPeriod} from './forecast-period';

describe('CLASS: ForecastPeriod', function() {

  const mock = JSON.parse(fs.readFileSync('src/discounted-cash-flow/forecast-period.mock.json', 'utf8'));

  beforeEach(function() {
    expect(mock.revenue).toBeTruthy();
    expect(mock.growthRates.length).toBeTruthy();
    this.forecastPeriod = new ForecastPeriod(mock.revenue, mock.growthRates);
    expect(this.forecastPeriod.revenues).toBeDefined();
  });

  it('should calculate projected revenues on initialization', function() {
    let revenue = mock.revenue;
    let revenues = mock.growthRates.map(growthRate => revenue = revenue * ( 1 + growthRate));

    expect(this.forecastPeriod.revenues.length).toBe(mock.growthRates.length);
    expect(this.forecastPeriod.revenues).toEqual(revenues);
  });

  it('should forecast net investments', function() {
    let netInvestmentPercentage = 0.15;
    let targetNetInvestmentPercentage = 0.25;
    let forecastedNetInvestments = this.forecastPeriod.forecastNetInvestments(netInvestmentPercentage, targetNetInvestmentPercentage);

    expect(forecastedNetInvestments.length).toEqual(this.forecastPeriod.revenues.length);
    expect(forecastedNetInvestments.pop()).toEqual(this.forecastPeriod.revenues.pop() * targetNetInvestmentPercentage);
  });

  it('should forecast operating costs', function() {
    let operatingCostsPercentage = 0.15;
    let targetOperatingCostsPercentage = 0.25;
    let forecastedOperatingCosts = this.forecastPeriod.forecastOperatingCosts(operatingCostsPercentage, targetOperatingCostsPercentage);

    expect(forecastedOperatingCosts.length).toEqual(this.forecastPeriod.revenues.length);
    expect(forecastedOperatingCosts.pop()).toEqual(this.forecastPeriod.revenues.pop() * targetOperatingCostsPercentage);
  });

  it('should forecast change in working capital', function() {
    let workingCapital = 1000;
    let changeInWorkingCapital = this.forecastPeriod.forecastChangeInWorkingCapital(workingCapital, mock.growthRates);

    expect(changeInWorkingCapital.length).toEqual(this.forecastPeriod.revenues.length);
  });
});
