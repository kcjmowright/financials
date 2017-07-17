Financials
=============

> Financial algorithms and REST services implemented in TypeScript.

## Setup

#### Prerequisites

* Node ^6.x LTS
* NPM ^3.x

#### Install from Source

```sh
git checkout https://github.com/kcjmowright/financials.git
npm install
```

#### Test

Linters and jasmine tests.

```sh
npm test
```

#### Database Setup

Create the database.  PostgreSQL was used to develop this.

```sh
createdb --username postgres -E UTF-8 -T template0 --no-password --locale C financials
knex migrate:make --env development --knexfile ./src/knexfile.ts financials
```

Configure the database connection in [config/db.json](config/db.json)

#### Build Live

Starts a HAPI server and restarts it when code changes.  Requires a valid database connection.
Configuration found at [config/manifest.json](config/manifest.json).

```sh
npm run start
```

#### Clean

Removes generated files.

```sh
npm run clean
```

## Modules

### Company

(todo)

### Discounted Cash Flow

(todo)

### Feeds

Services for pulling stock and company data.

[README](src/server/feeds/README.md)

### Indicators

Stock value indicators.

[README](src/indicators/README.md)

### Math

Functions and classes used in math operations.

- average
- interest
- line
- median
- point
- sum
- variance

### Options

(todo)

### Shared

(todo)



