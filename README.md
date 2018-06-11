Financials
=============

> Financial algorithms and REST services implemented in TypeScript.

## Setup

#### Prerequisites

* Node ^10.x LTS
* NPM ^6.x

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
```

Configure the database connection in [config/db.json](config/db.json)

#### Build Live

Starts a HAPI server and restarts it when code changes.  Requires a valid database connection.
Server configuration found at [config/manifest.json](config/manifest.json).

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
- least squares (linear regression)
- line
- median
- point
- sum
- variance

### Options

(todo)

### Server

REST endpoints.  Default port runs on 9000.

* GET /balance-sheet
* GET /balance-sheet/{id}
* GET /cash-flow
* GET /cash-flow/{id}
* GET /company
* GET /company/{id}
* GET /company/ticker/{ticker}
* POST /company
* PUT /company
* DELETE /company/{id}
* PUT /company/populate
* PUT /fundamentals
* GET /income-statement
* GET /income-statement/{id}
* GET /quote/{ticker}
* GET /quote/{ticker}/latest
* GET /quote/{symbol}/average-price/{period}
* GET /quote/{symbol}/average-volume/{period}
* GET /quote/{symbol}/average-volume-price/{period}
* GET /quote/top-price-movers/{period}
* GET /quote/top-volume-movers/{period}
* POST /quote
* PUT /quote
* DELETE /quote/{id}
* PUT /quote/populate
* GET /linear-regression/{symbol}?limit=x
* GET /macd/{symbol}?limit=x&period=x
* GET /macd/{symbol}.csv
* GET /rsi/{symbol}
* GET /stochastic-oscillator/{symbol}


### Shared

- *`DateUtil`* Utility to convert dates to and from UTC strings.
- *`PageRequest`* Data object that describes the page number and size and the expected sort and sort direction.
- *`PageResults`* Data object that extends a `PageRequest` and adds the count of total results.




