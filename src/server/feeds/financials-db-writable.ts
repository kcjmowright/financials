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
            symbol: incomeStatements.symbol,
            endDate: statement.endDate
          }).select('id').then((results) => {
            if (!results.length) {
              return knex('incomestatements').insert({
                symbol: incomeStatements.symbol,
                endDate: statement.endDate,
                revenue: statement.revenue,
                otherRevenueTotal: statement.otherRevenueTotal,
                totalRevenue: statement.totalRevenue,
                costOfRevenueTotal: statement.costOfRevenueTotal,
                grossProfit: statement.grossProfit,
                sellingGeneralAdminExpensesTotal: statement.sellingGeneralAdminExpensesTotal,
                researchDevelopment: statement.researchDevelopment,
                depreciationAmortization: statement.depreciationAmortization,
                interestExpenseIncomeNetOperating: statement.interestExpenseIncomeNetOperating,
                unusualExpenseIncome: statement.unusualExpenseIncome,
                otherOperatingExpensesTotal: statement.otherOperatingExpensesTotal,
                totalOperatingExpense: statement.totalOperatingExpense,
                operatingIncome: statement.operatingIncome,
                interestIncomeExpenseNetNonOperating: statement.interestIncomeExpenseNetNonOperating,
                gainLossOnSaleOfAssets: statement.gainLossOnSaleOfAssets,
                otherNet: statement.otherNet,
                incomeBeforeTax: statement.incomeBeforeTax,
                incomeAfterTax: statement.incomeAfterTax,
                minorityInterest: statement.minorityInterest,
                equityInAffiliates: statement.equityInAffiliates,
                netIncomeBeforeExtraItems: statement.netIncomeBeforeExtraItems,
                accountingChange: statement.accountingChange,
                discontinuedOperations: statement.discontinuedOperations,
                extraordinaryItem: statement.extraordinaryItem,
                netIncome: statement.netIncome,
                preferredDividends: statement.preferredDividends,
                incomeAvailableToCommonExclExtraItems: statement.incomeAvailableToCommonExclExtraItems,
                incomeAvailableToCommonInclExtraItems: statement.incomeAvailableToCommonInclExtraItems,
                basicWeightedAverageShares: statement.basicWeightedAverageShares,
                basicEpsExcludingExtraordinaryItems: statement.basicEpsExcludingExtraordinaryItems,
                basicEpsIncludingExtraordinaryItems: statement.basicEpsIncludingExtraordinaryItems,
                dilutionAdjustment: statement.dilutionAdjustment,
                dilutedWeightedAverageShares: statement.dilutedWeightedAverageShares,
                dilutedEpsExcludingExtraordinaryItems: statement.dilutedEpsExcludingExtraordinaryItems,
                dilutedEpsIncludingExtraordinaryItems: statement.dilutedEpsIncludingExtraordinaryItems,
                dividendsPerShareCommonStockPrimaryIssue: statement.dividendsPerShareCommonStockPrimaryIssue,
                grossDividendsCommonStock: statement.grossDividendsCommonStock,
                netIncomeAfterStockBasedCompExpense: statement.netIncomeAfterStockBasedCompExpense,
                basicEpsAfterStockBasedCompExpense: statement.basicEpsAfterStockBasedCompExpense,
                dilutedEpsAfterStockBasedCompExpense: statement.dilutedEpsAfterStockBasedCompExpense,
                depreciationSupplemental: statement.depreciationSupplemental,
                totalSpecialItems: statement.totalSpecialItems,
                normalizedIncomeBeforeTaxes: statement.normalizedIncomeBeforeTaxes,
                effectOfSpecialItemsOnIncomeTaxes: statement.effectOfSpecialItemsOnIncomeTaxes,
                incomeTaxesExImpactOfSpecialItems: statement.incomeTaxesExImpactOfSpecialItems,
                normalizedIncomeAfterTaxes: statement.normalizedIncomeAfterTaxes,
                normalizedIncomeAvailToCommon: statement.normalizedIncomeAvailToCommon,
                basicNormalizedEps: statement.basicNormalizedEps,
                dilutedNormalizedEps: statement.dilutedNormalizedEps
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
            symbol: balanceSheets.symbol,
            endDate: statement.endDate
          }).select('id').then((results) => {
            if (!results.length) {
              return knex('balancesheets').insert({
                symbol: balanceSheets.symbol,
                endDate: statement.endDate,
                cashEquivalents: statement.cashEquivalents,
                shortTermInvestments: statement.shortTermInvestments,
                cashAndShortTermInvestments: statement.cashAndShortTermInvestments,
                accountsReceivableTradeNet: statement.accountsReceivableTradeNet,
                receivablesOther: statement.receivablesOther,
                totalReceivablesNet: statement.totalReceivablesNet,
                totalInventory: statement.totalInventory,
                prepaidExpenses: statement.prepaidExpenses,
                otherCurrentAssetsTotal: statement.otherCurrentAssetsTotal,
                totalCurrentAssets: statement.totalCurrentAssets,
                propertyPlantEquipmentTotalGross: statement.propertyPlantEquipmentTotalGross,
                accumulatedDepreciationTotal: statement.accumulatedDepreciationTotal,
                goodwillNet: statement.goodwillNet,
                intangiblesNet: statement.intangiblesNet,
                longTermInvestments: statement.longTermInvestments,
                otherLongTermAssetsTotal: statement.otherLongTermAssetsTotal,
                totalAssets: statement.totalAssets,
                accountsPayable: statement.accountsPayable,
                accruedExpenses: statement.accruedExpenses,
                notesPayableShortTermDebt: statement.notesPayableShortTermDebt,
                currentPortOfLtDebtCapitalLeases: statement.currentPortOfLtDebtCapitalLeases,
                otherCurrentLiabilitiesTotal: statement.otherCurrentLiabilitiesTotal,
                totalCurrentLiabilities: statement.totalCurrentLiabilities,
                longTermDebt: statement.longTermDebt,
                capitalLeaseObligations: statement.capitalLeaseObligations,
                totalLongTermDebt: statement.totalLongTermDebt,
                totalDebt: statement.totalDebt,
                deferredIncomeTax: statement.deferredIncomeTax,
                minorityInterest: statement.minorityInterest,
                otherLiabilitiesTotal: statement.otherLiabilitiesTotal,
                totalLiabilities: statement.totalLiabilities,
                redeemablePreferredStockTotal: statement.redeemablePreferredStockTotal,
                preferredStockNonRedeemableNet: statement.preferredStockNonRedeemableNet,
                commonStockTotal: statement.commonStockTotal,
                additionalPaidInCapital: statement.additionalPaidInCapital,
                retainedEarningsAccumulatedDeficit: statement.retainedEarningsAccumulatedDeficit,
                treasuryStockCommon: statement.treasuryStockCommon,
                otherEquityTotal: statement.otherEquityTotal,
                totalEquity: statement.totalEquity,
                totalLiabilitiesShareholdersEquity: statement.totalLiabilitiesShareholdersEquity,
                sharesOutsCommonStockPrimaryIssue: statement.sharesOutsCommonStockPrimaryIssue,
                totalCommonSharesOutstanding: statement.totalCommonSharesOutstanding
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
            symbol: cashFlows.symbol,
            endDate: statement.endDate
          }).select('id').then((results) => {
            if (!results.length) {
              return knex('cashflows').insert({
                symbol: cashFlows.symbol,
                endDate: statement.endDate,
                netIncomeStartingLine: statement.netIncomeStartingLine,
                depreciationDepletion: statement.depreciationDepletion,
                amortization: statement.amortization,
                deferredTaxes: statement.deferredTaxes,
                nonCashItems: statement.nonCashItems,
                changesInWorkingCapital: statement.changesInWorkingCapital,
                cashFromOperatingActivities: statement.cashFromOperatingActivities,
                capitalExpenditures: statement.capitalExpenditures,
                otherInvestingCashFlowItemsTotal: statement.otherInvestingCashFlowItemsTotal,
                cashFromInvestingActivities: statement.cashFromInvestingActivities,
                financingCashFlowItems: statement.financingCashFlowItems,
                totalCashDividendsPaid: statement.totalCashDividendsPaid,
                issuanceRetirementOfStockNet: statement.issuanceRetirementOfStockNet,
                issuanceRetirementOfDebtNet: statement.issuanceRetirementOfDebtNet,
                cashFromFinancingActivities: statement.cashFromFinancingActivities,
                foreignExchangeEffects: statement.foreignExchangeEffects,
                netChangeInCash: statement.netChangeInCash,
                cashInterestPaidSupplemental: statement.cashInterestPaidSupplemental,
                cashTaxesPaidSupplemental: statement.cashTaxesPaidSupplemental
              });
            }
          }));
        });
        Promise.all(promises).then(next, e => next(e));
      }
    });
  }
}
