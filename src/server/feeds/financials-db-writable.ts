import {Writable} from 'stream';
import * as Knex from 'knex';
import {Promise} from 'bluebird';
import {BalanceStatement, CashFlowStatement, IncomeStatement} from '../../company';

/**
 * A Writable database stream
 */
export class FinancialsDbWritable extends Writable {
  constructor(knex: Knex) {
    super({
      objectMode: true,
      write: (statements: any, enc: any, next: Function) => {

        let promises = [];
        let incomeStatements = statements[0];
        let balanceSheets = statements[1];
        let cashFlows = statements[2];

        // Income Statements
        incomeStatements.quarters.forEach((statement: IncomeStatement) => {
          if(!statement || !statement.endDate) {
            return;
          }
          promises.push(knex('incomestatements').where({
            endDate: statement.endDate,
            symbol: incomeStatements.symbol
          }).select('id').then((results) => {
            if (!results.length) {
              return knex('incomestatements').insert({
                accountingChange: statement.accountingChange,
                basicEpsAfterStockBasedCompExpense: statement.basicEpsAfterStockBasedCompExpense,
                basicEpsExcludingExtraordinaryItems: statement.basicEpsExcludingExtraordinaryItems,
                basicEpsIncludingExtraordinaryItems: statement.basicEpsIncludingExtraordinaryItems,
                basicNormalizedEps: statement.basicNormalizedEps,
                basicWeightedAverageShares: statement.basicWeightedAverageShares,
                costOfRevenueTotal: statement.costOfRevenueTotal,
                depreciationAmortization: statement.depreciationAmortization,
                depreciationSupplemental: statement.depreciationSupplemental,
                dilutedEpsAfterStockBasedCompExpense: statement.dilutedEpsAfterStockBasedCompExpense,
                dilutedEpsExcludingExtraordinaryItems: statement.dilutedEpsExcludingExtraordinaryItems,
                dilutedEpsIncludingExtraordinaryItems: statement.dilutedEpsIncludingExtraordinaryItems,
                dilutedNormalizedEps: statement.dilutedNormalizedEps,
                dilutedWeightedAverageShares: statement.dilutedWeightedAverageShares,
                dilutionAdjustment: statement.dilutionAdjustment,
                discontinuedOperations: statement.discontinuedOperations,
                dividendsPerShareCommonStockPrimaryIssue: statement.dividendsPerShareCommonStockPrimaryIssue,
                effectOfSpecialItemsOnIncomeTaxes: statement.effectOfSpecialItemsOnIncomeTaxes,
                endDate: statement.endDate,
                equityInAffiliates: statement.equityInAffiliates,
                extraordinaryItem: statement.extraordinaryItem,
                gainLossOnSaleOfAssets: statement.gainLossOnSaleOfAssets,
                grossDividendsCommonStock: statement.grossDividendsCommonStock,
                grossProfit: statement.grossProfit,
                incomeAfterTax: statement.incomeAfterTax,
                incomeAvailableToCommonExclExtraItems: statement.incomeAvailableToCommonExclExtraItems,
                incomeAvailableToCommonInclExtraItems: statement.incomeAvailableToCommonInclExtraItems,
                incomeBeforeTax: statement.incomeBeforeTax,
                incomeTaxesExImpactOfSpecialItems: statement.incomeTaxesExImpactOfSpecialItems,
                interestExpenseIncomeNetOperating: statement.interestExpenseIncomeNetOperating,
                interestIncomeExpenseNetNonOperating: statement.interestIncomeExpenseNetNonOperating,
                minorityInterest: statement.minorityInterest,
                netIncome: statement.netIncome,
                netIncomeAfterStockBasedCompExpense: statement.netIncomeAfterStockBasedCompExpense,
                netIncomeBeforeExtraItems: statement.netIncomeBeforeExtraItems,
                normalizedIncomeAfterTaxes: statement.normalizedIncomeAfterTaxes,
                normalizedIncomeAvailToCommon: statement.normalizedIncomeAvailToCommon,
                normalizedIncomeBeforeTaxes: statement.normalizedIncomeBeforeTaxes,
                operatingIncome: statement.operatingIncome,
                otherNet: statement.otherNet,
                otherOperatingExpensesTotal: statement.otherOperatingExpensesTotal,
                otherRevenueTotal: statement.otherRevenueTotal,
                preferredDividends: statement.preferredDividends,
                researchDevelopment: statement.researchDevelopment,
                revenue: statement.revenue,
                sellingGeneralAdminExpensesTotal: statement.sellingGeneralAdminExpensesTotal,
                symbol: incomeStatements.symbol,
                totalOperatingExpense: statement.totalOperatingExpense,
                totalRevenue: statement.totalRevenue,
                totalSpecialItems: statement.totalSpecialItems,
                unusualExpenseIncome: statement.unusualExpenseIncome
              });
            }
          }));
        });

        // Balance Statements
        balanceSheets.quarters.forEach((statement: BalanceStatement) => {
          if(!statement || !statement.endDate) {
            return;
          }
          promises.push(knex('balancesheets').where({
            endDate: statement.endDate,
            symbol: balanceSheets.symbol
          }).select('id').then((results) => {
            if (!results.length) {
              return knex('balancesheets').insert({
                accountsPayable: statement.accountsPayable,
                accountsReceivableTradeNet: statement.accountsReceivableTradeNet,
                accruedExpenses: statement.accruedExpenses,
                accumulatedDepreciationTotal: statement.accumulatedDepreciationTotal,
                additionalPaidInCapital: statement.additionalPaidInCapital,
                capitalLeaseObligations: statement.capitalLeaseObligations,
                cashAndShortTermInvestments: statement.cashAndShortTermInvestments,
                cashEquivalents: statement.cashEquivalents,
                commonStockTotal: statement.commonStockTotal,
                currentPortOfLtDebtCapitalLeases: statement.currentPortOfLtDebtCapitalLeases,
                deferredIncomeTax: statement.deferredIncomeTax,
                endDate: statement.endDate,
                goodwillNet: statement.goodwillNet,
                intangiblesNet: statement.intangiblesNet,
                longTermDebt: statement.longTermDebt,
                longTermInvestments: statement.longTermInvestments,
                minorityInterest: statement.minorityInterest,
                notesPayableShortTermDebt: statement.notesPayableShortTermDebt,
                otherCurrentAssetsTotal: statement.otherCurrentAssetsTotal,
                otherCurrentLiabilitiesTotal: statement.otherCurrentLiabilitiesTotal,
                otherEquityTotal: statement.otherEquityTotal,
                otherLiabilitiesTotal: statement.otherLiabilitiesTotal,
                otherLongTermAssetsTotal: statement.otherLongTermAssetsTotal,
                preferredStockNonRedeemableNet: statement.preferredStockNonRedeemableNet,
                prepaidExpenses: statement.prepaidExpenses,
                propertyPlantEquipmentTotalGross: statement.propertyPlantEquipmentTotalGross,
                receivablesOther: statement.receivablesOther,
                redeemablePreferredStockTotal: statement.redeemablePreferredStockTotal,
                retainedEarningsAccumulatedDeficit: statement.retainedEarningsAccumulatedDeficit,
                sharesOutsCommonStockPrimaryIssue: statement.sharesOutsCommonStockPrimaryIssue,
                shortTermInvestments: statement.shortTermInvestments,
                symbol: balanceSheets.symbol,
                totalAssets: statement.totalAssets,
                totalCommonSharesOutstanding: statement.totalCommonSharesOutstanding,
                totalCurrentAssets: statement.totalCurrentAssets,
                totalCurrentLiabilities: statement.totalCurrentLiabilities,
                totalDebt: statement.totalDebt,
                totalEquity: statement.totalEquity,
                totalInventory: statement.totalInventory,
                totalLiabilities: statement.totalLiabilities,
                totalLiabilitiesShareholdersEquity: statement.totalLiabilitiesShareholdersEquity,
                totalLongTermDebt: statement.totalLongTermDebt,
                totalReceivablesNet: statement.totalReceivablesNet,
                treasuryStockCommon: statement.treasuryStockCommon
              });
            }
          }));
        });

        // Cash Flow Statements
        cashFlows.quarters.forEach((statement: CashFlowStatement) => {
          if(!statement || !statement.endDate) {
            return;
          }
          promises.push(knex('cashflows').where({
            endDate: statement.endDate,
            symbol: cashFlows.symbol
          }).select('id').then((results) => {
            if (!results.length) {
              return knex('cashflows').insert({
                amortization: statement.amortization,
                capitalExpenditures: statement.capitalExpenditures,
                cashFromFinancingActivities: statement.cashFromFinancingActivities,
                cashFromInvestingActivities: statement.cashFromInvestingActivities,
                cashFromOperatingActivities: statement.cashFromOperatingActivities,
                cashInterestPaidSupplemental: statement.cashInterestPaidSupplemental,
                cashTaxesPaidSupplemental: statement.cashTaxesPaidSupplemental,
                changesInWorkingCapital: statement.changesInWorkingCapital,
                deferredTaxes: statement.deferredTaxes,
                depreciationDepletion: statement.depreciationDepletion,
                endDate: statement.endDate,
                financingCashFlowItems: statement.financingCashFlowItems,
                foreignExchangeEffects: statement.foreignExchangeEffects,
                issuanceRetirementOfDebtNet: statement.issuanceRetirementOfDebtNet,
                issuanceRetirementOfStockNet: statement.issuanceRetirementOfStockNet,
                netChangeInCash: statement.netChangeInCash,
                netIncomeStartingLine: statement.netIncomeStartingLine,
                nonCashItems: statement.nonCashItems,
                otherInvestingCashFlowItemsTotal: statement.otherInvestingCashFlowItemsTotal,
                symbol: cashFlows.symbol,
                totalCashDividendsPaid: statement.totalCashDividendsPaid
              });
            }
          }));
        });
        Promise.all(promises).then(next, e => next(e));
      }
    });
  }
}
