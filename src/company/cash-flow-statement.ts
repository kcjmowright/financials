export class CashFlowStatement {
  public id?: number;
  public symbol: string;
  public endDate: Date;
  public netIncomeStartingLine: number;
  public depreciationDepletion: number;
  public amortization: number;
  public deferredTaxes: number;
  public nonCashItems: number;
  public changesInWorkingCapital: number;
  public cashFromOperatingActivities: number;
  public capitalExpenditures: number;
  public otherInvestingCashFlowItemsTotal: number;
  public cashFromInvestingActivities: number;
  public financingCashFlowItems: number;
  public totalCashDividendsPaid: number;
  public issuanceRetirementOfStockNet: number;
  public issuanceRetirementOfDebtNet: number;
  public cashFromFinancingActivities: number;
  public foreignExchangeEffects: number;
  public netChangeInCash: number;
  public cashInterestPaidSupplemental: number;
  public cashTaxesPaidSupplemental: number;
}
