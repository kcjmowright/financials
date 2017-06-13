import * as fs from 'fs';
import * as _ from 'lodash';

import {average} from '../shared';
import {Financials} from './financials';

describe('Class: Financials', function() {

  const mock = JSON.parse(fs.readFileSync('src/company/financials.mock.json', 'utf8'));

  beforeEach(function() {
    this.financials = new Financials();
    _.assign(this.financials, mock);
  });

  it('should calculate net investment', function() {
    expect(this.financials.netInvestment())
      .toBe(this.financials.capitalExpenditure - this.financials.nonCashDepreciation);
  });

  it('should calculate net investment percentage', function() {
    expect(this.financials.netInvestmentPercentage())
      .toBe(this.financials.netInvestment() / this.financials.revenue);
  });

  it('should calculate operating costs', function() {
    expect(this.financials.operatingCosts())
      .toBe(this.financials.revenue - this.financials.netIncome);
  });

  it('should calculate operate costs percentage', function() {
    expect(this.financials.operatingCostsPercentage())
      .toBe(this.financials.operatingCosts() / this.financials.netSales);
  });

  it('should calculate tax rate with one year of tax', function() {
    expect(this.financials.taxRate())
      .toBe(this.financials.getIncomeTax() / this.financials.incomePreTax);
  });

  it('should calculate tax rate with multiple years of tax', function() {
    let taxes = [ 10, 15, 20 ];

    this.financials.incomeTaxTotal = taxes;
    expect(this.financials.taxRate())
      .toBe( average(taxes) / this.financials.incomePreTax);
  });

  it('should calculate working capital', function() {
    expect(this.financials.workingCapital())
      .toBe(this.financials.assets - this.financials.liabilities)
  });

});
