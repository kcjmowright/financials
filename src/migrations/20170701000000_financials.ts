import * as Knex from 'knex';
import * as Promise from 'bluebird';

export function up(knex: Knex): Promise<any> {
  return Promise.all([

    knex.schema.createTable('incomestatements', function(table) {
      table.increments('id').primary();
      table.string('symbol')
        .references('ticker')
        .inTable('companies');
      table.date('endDate');
      table.decimal('revenue', 16, 2);
      table.decimal('otherRevenueTotal', 16, 2);
      table.decimal('totalRevenue', 16, 2);
      table.decimal('costOfRevenueTotal', 16, 2);
      table.decimal('grossProfit', 16, 2);
      table.decimal('sellingGeneralAdminExpensesTotal', 16, 2);
      table.decimal('researchDevelopment', 16, 2);
      table.decimal('depreciationAmortization', 16, 2);
      table.decimal('interestExpenseIncomeNetOperating', 16, 2);
      table.decimal('unusualExpenseIncome', 16, 2);
      table.decimal('otherOperatingExpensesTotal', 16, 2);
      table.decimal('totalOperatingExpense', 16, 2);
      table.decimal('operatingIncome', 16, 2);
      table.decimal('interestIncomeExpenseNetNonOperating', 16, 2);
      table.decimal('gainLossOnSaleOfAssets', 16, 2);
      table.decimal('otherNet', 16, 2);
      table.decimal('incomeBeforeTax', 16, 2);
      table.decimal('incomeAfterTax', 16, 2);
      table.decimal('minorityInterest', 16, 2);
      table.decimal('equityInAffiliates', 16, 2);
      table.decimal('netIncomeBeforeExtraItems', 16, 2);
      table.decimal('accountingChange', 16, 2);
      table.decimal('discontinuedOperations', 16, 2);
      table.decimal('extraordinaryItem', 16, 2);
      table.decimal('netIncome', 16, 2);
      table.decimal('preferredDividends', 16, 2);
      table.decimal('incomeAvailableToCommonExclExtraItems', 16, 2);
      table.decimal('incomeAvailableToCommonInclExtraItems', 16, 2);
      table.decimal('basicWeightedAverageShares', 16, 2);
      table.decimal('basicEpsExcludingExtraordinaryItems', 16, 2);
      table.decimal('basicEpsIncludingExtraordinaryItems', 16, 2);
      table.decimal('dilutionAdjustment', 16, 2);
      table.decimal('dilutedWeightedAverageShares', 16, 2);
      table.decimal('dilutedEpsExcludingExtraordinaryItems', 16, 2);
      table.decimal('dilutedEpsIncludingExtraordinaryItems', 16, 2);
      table.decimal('dividendsPerShareCommonStockPrimaryIssue', 16, 2);
      table.decimal('grossDividendsCommonStock', 16, 2);
      table.decimal('netIncomeAfterStockBasedCompExpense', 16, 2);
      table.decimal('basicEpsAfterStockBasedCompExpense', 16, 2);
      table.decimal('dilutedEpsAfterStockBasedCompExpense', 16, 2);
      table.decimal('depreciationSupplemental', 16, 2);
      table.decimal('totalSpecialItems', 16, 2);
      table.decimal('normalizedIncomeBeforeTaxes', 16, 2);
      table.decimal('effectOfSpecialItemsOnIncomeTaxes', 16, 2);
      table.decimal('incomeTaxesExImpactOfSpecialItems', 16, 2);
      table.decimal('normalizedIncomeAfterTaxes', 16, 2);
      table.decimal('normalizedIncomeAvailToCommon', 16, 2);
      table.decimal('basicNormalizedEps', 16, 2);
      table.decimal('dilutedNormalizedEps', 16, 2);
      table.unique(['symbol', 'endDate']);
      table.index('symbol', 'incomestatements_symbol_index');
    }),

    knex.schema.createTable('balancesheets', function(table) {
      table.increments('id').primary();
      table.string('symbol')
        .references('ticker')
        .inTable('companies');
      table.date('endDate');
      table.decimal('cashEquivalents', 16, 2);
      table.decimal('shortTermInvestments', 16, 2);
      table.decimal('cashAndShortTermInvestments', 16, 2);
      table.decimal('accountsReceivableTradeNet', 16, 2);
      table.decimal('receivablesOther', 16, 2);
      table.decimal('totalReceivablesNet', 16, 2);
      table.decimal('totalInventory', 16, 2);
      table.decimal('prepaidExpenses', 16, 2);
      table.decimal('otherCurrentAssetsTotal', 16, 2);
      table.decimal('totalCurrentAssets', 16, 2);
      table.decimal('propertyPlantEquipmentTotalGross', 16, 2);
      table.decimal('accumulatedDepreciationTotal', 16, 2);
      table.decimal('goodwillNet', 16, 2);
      table.decimal('intangiblesNet', 16, 2);
      table.decimal('longTermInvestments', 16, 2);
      table.decimal('otherLongTermAssetsTotal', 16, 2);
      table.decimal('totalAssets', 16, 2);
      table.decimal('accountsPayable', 16, 2);
      table.decimal('accruedExpenses', 16, 2);
      table.decimal('notesPayableShortTermDebt', 16, 2);
      table.decimal('currentPortOfLtDebtCapitalLeases', 16, 2);
      table.decimal('otherCurrentLiabilitiesTotal', 16, 2);
      table.decimal('totalCurrentLiabilities', 16, 2);
      table.decimal('longTermDebt', 16, 2);
      table.decimal('capitalLeaseObligations', 16, 2);
      table.decimal('totalLongTermDebt', 16, 2);
      table.decimal('totalDebt', 16, 2);
      table.decimal('deferredIncomeTax', 16, 2);
      table.decimal('minorityInterest', 16, 2);
      table.decimal('otherLiabilitiesTotal', 16, 2);
      table.decimal('totalLiabilities', 16, 2);
      table.decimal('redeemablePreferredStockTotal', 16, 2);
      table.decimal('preferredStockNonRedeemableNet', 16, 2);
      table.decimal('commonStockTotal', 16, 2);
      table.decimal('additionalPaidInCapital', 16, 2);
      table.decimal('retainedEarningsAccumulatedDeficit', 16, 2);
      table.decimal('treasuryStockCommon', 16, 2);
      table.decimal('otherEquityTotal', 16, 2);
      table.decimal('totalEquity', 16, 2);
      table.decimal('totalLiabilitiesShareholdersEquity', 16, 2);
      table.decimal('sharesOutsCommonStockPrimaryIssue', 16, 2);
      table.decimal('totalCommonSharesOutstanding', 16, 2);
      table.unique(['symbol', 'endDate']);
      table.index('symbol', 'balancesheets_symbol_index');
    }),

    knex.schema.createTable('cashflows', function(table) {
      table.increments('id').primary();
      table.string('symbol')
        .references('ticker')
        .inTable('companies');
      table.date('endDate');
      table.decimal('netIncomeStartingLine', 16, 2);
      table.decimal('depreciationDepletion', 16, 2);
      table.decimal('amortization', 16, 2);
      table.decimal('deferredTaxes', 16, 2);
      table.decimal('nonCashItems', 16, 2);
      table.decimal('changesInWorkingCapital', 16, 2);
      table.decimal('cashFromOperatingActivities', 16, 2);
      table.decimal('capitalExpenditures', 16, 2);
      table.decimal('otherInvestingCashFlowItemsTotal', 16, 2);
      table.decimal('cashFromInvestingActivities', 16, 2);
      table.decimal('financingCashFlowItems', 16, 2);
      table.decimal('totalCashDividendsPaid', 16, 2);
      table.decimal('issuanceRetirementOfStockNet', 16, 2);
      table.decimal('issuanceRetirementOfDebtNet', 16, 2);
      table.decimal('cashFromFinancingActivities', 16, 2);
      table.decimal('foreignExchangeEffects', 16, 2);
      table.decimal('netChangeInCash', 16, 2);
      table.decimal('cashInterestPaidSupplemental', 16, 2);
      table.decimal('cashTaxesPaidSupplemental', 16, 2);
      table.unique(['symbol', 'endDate']);
      table.index('symbol', 'cashflows_symbol_index');
    })
  ]);
}

export function down(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTable('incomestatements'),
    knex.schema.dropTable('balancesheets'),
    knex.schema.dropTable('cashflows')
  ]);
}
