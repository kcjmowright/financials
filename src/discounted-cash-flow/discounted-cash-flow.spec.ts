import * as fs from 'fs';
import * as _ from 'lodash';

import {DiscountedCashFlow} from './discounted-cash-flow';
import {Fundamentals} from '../company/fundamentals';
import {ForecastPeriod} from './forecast-period';

describe('CLASS: DiscountedCashFlow', function() {

  const forecastPeriodMock = JSON.parse(fs.readFileSync('src/discounted-cash-flow/forecast-period.mock.json', 'utf8'));
  const discountedCashFlowMock = JSON.parse(fs.readFileSync('src/discounted-cash-flow/discounted-cash-flow.mock.json', 'utf8'));
  const financialsMock = JSON.parse(fs.readFileSync('src/company/fundamentals.mock.json', 'utf8'));

  beforeEach(function() {
    expect(forecastPeriodMock).toBeDefined();
    expect(discountedCashFlowMock).toBeDefined();
    expect(financialsMock).toBeDefined();

    this.fundamentals = new Fundamentals();
    _.assign(this.fundamentals, financialsMock);

    this.forecastPeriod = new ForecastPeriod(forecastPeriodMock.revenue, forecastPeriodMock.growthRates);
    this.discountedCashFlow = new DiscountedCashFlow(this.fundamentals, this.forecastPeriod,
      discountedCashFlowMock.targetNetInvestmentPercentage, discountedCashFlowMock.targetOperatingCostsPercentage);
  });

  it('should calculate discounted value for given criteria', function() {
    expect(this.discountedCashFlow.discountedCashFlowValues).toBeDefined();
    expect(this.discountedCashFlow.discountedCashFlowValues.length).toBe(1);
    expect(this.discountedCashFlow.discountedCashFlowValues[0]).toBe(1300.3583983501226);
  });

});
