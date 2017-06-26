import * as Knex from 'knex';
import * as fs from 'fs';
import * as pg from 'pg';

/**
 * PG-node has to return strings because Javascript's numbers aren't long enough to handle the big numbers psql can handle.
 * For a complete list
 * ﻿psql -c "select typname, oid, typarray from pg_type order by typname"
 * @type {number}
 */
const PG_DECIMAL_OID = 1700;
const PG_BIGINT_OID = 20;

pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
pg.types.setTypeParser(PG_BIGINT_OID, parseInt);

const config = JSON.parse(fs.readFileSync('./config/db.json', 'utf8'));
let env = 'development'; // <= TODO: Change to environmental variable read.
let knex = Knex(config[env]);

// Migrate to the latest everytime.
knex.migrate.latest(config[env].migrations);

export {knex};
