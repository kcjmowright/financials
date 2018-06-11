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
      table.index('ticker', 'companies_ticker_index');
    }),

    knex.schema.createTable('quotes', function(table) {
      table.increments('id').primary();
      table.string('ticker')
        .references('ticker')
        .inTable('companies');
      table.timestamp('x'); // <= price date
      table.decimal('open', 8, 4);
      table.decimal('high', 8, 4);
      table.decimal('low', 8, 4);
      table.decimal('y', 8, 4); // <= price
      table.bigInteger('volume');
      table.decimal('changed', 8, 4);
      table.decimal('changep', 8, 4);
      table.decimal('adjclose', 8, 4);
      table.decimal('tradeval', 16, 2);
      table.bigInteger('tradevol');
      table.index('ticker', 'quotes_ticker_index');
      table.unique(['ticker', 'x']);
    })
  ]);
}

export function down(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTable('companies'),
    knex.schema.dropTable('quotes')
  ]);
}
