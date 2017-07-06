import * as fs from 'fs';
import * as _ from 'lodash';

import {average} from '../math';
import {Fundamentals} from './fundamentals';

describe('Class: Fundamentals', function() {

  const mock = JSON.parse(fs.readFileSync('src/company/fundamentals.mock.json', 'utf8'));

  beforeEach(function() {
    this.fundamentals = new Fundamentals();
    _.assign(this.fundamentals, mock);
  });

  it('should calculate net investment', function() {
    expect(this.fundamentals.netInvestment())
      .toBe(this.fundamentals.capitalExpenditure - this.fundamentals.nonCashDepreciation);
  });

  it('should calculate net investment percentage', function() {
    expect(this.fundamentals.netInvestmentPercentage())
      .toBe(this.fundamentals.netInvestment() / this.fundamentals.revenue);
  });

  it('should calculate operating costs', function() {
    expect(this.fundamentals.operatingCosts())
      .toBe(this.fundamentals.revenue - this.fundamentals.netIncome);
  });

  it('should calculate operate costs percentage', function() {
    expect(this.fundamentals.operatingCostsPercentage())
      .toBe(this.fundamentals.operatingCosts() / this.fundamentals.netSales);
  });

  it('should calculate tax rate with one year of tax', function() {
    expect(this.fundamentals.taxRate())
      .toBe(this.fundamentals.getIncomeTax() / this.fundamentals.incomePreTax);
  });

  it('should calculate tax rate with multiple years of tax', function() {
    let taxes = [ 10, 15, 20 ];

    this.fundamentals.incomeTaxTotal = taxes;
    expect(this.fundamentals.taxRate())
      .toBe( average(taxes) / this.fundamentals.incomePreTax);
  });

  it('should calculate working capital', function() {
    expect(this.fundamentals.workingCapital())
      .toBe(this.fundamentals.assets - this.fundamentals.liabilities)
  });

});
