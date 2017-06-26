import * as Knex from 'knex';
import * as Promise from 'bluebird';

export function up(knex: Knex): Promise<any> {
  return Promise.all([

    knex.schema.createTable('companies', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('ticker');
      table.string('sector');
      table.string('industry');
      table.string('exchange');
      table.timestamps();
      table.unique('ticker');
      table.index('ticker', 'ticker_index');
    }),

    knex.schema.createTable('fundamentals', function(table){
      table.increments('id').primary();
      table.integer('companyId')
        .references('id')
        .inTable('companies');
      table.integer('year');
      table.decimal('assets', 12, 2);
      table.decimal('beta', 8, 4);
      table.decimal('capitalExpenditure', 12, 2);
      table.decimal('changesInWorkingCapital', 12, 2);
      table.decimal('debt', 12, 2);
      table.decimal('equity', 12, 2);
      table.decimal('incomePreTax', 12, 2);
      table.decimal('incomeTaxTotal', 12, 2);
      table.decimal('interestExpense', 12, 2);
      table.decimal('liabilities', 12, 2);
      table.decimal('netIncome', 12, 2);
      table.decimal('netSales', 12, 2);
      table.decimal('nonCashDepreciation', 12, 2);
      table.decimal('outstandingShares', 12, 2);
      table.decimal('revenue', 12, 2);
      table.timestamps();
    }),

    knex.schema.createTable('quotes', function(table){
      table.increments('id').primary();
      table.string('ticker')
        .references('ticker')
        .inTable('companies');
      table.timestamp('date');
      table.decimal('open', 8, 4);
      table.decimal('high', 8, 4);
      table.decimal('low', 8, 4);
      table.decimal('close', 8, 4);
      table.bigInteger('volume');
      table.decimal('changed', 8, 4);
      table.decimal('changep', 8, 4);
      table.decimal('adjclose', 8, 4);
      table.decimal('tradeval', 16, 2);
      table.bigInteger('tradevol');
      table.index('ticker', 'ticker_index');
    })
  ]);
}

export function down(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTable('companies'),
    knex.schema.dropTable('fundamentals'),
    knex.schema.dropTable('quotes')
  ]);
}
