Financials
=============

> Financial algorithms implemented in TypeScript

## Setup

#### Prerequisites

* Node 6.x LTS
* NPM ^3.10

#### Install

```sh
git checkout https://github.com/kcjmowright/financials.git
npm install
```

#### Test

```sh
npm test
```

#### Build Live

```sh
npm run start
```

#### Clean

```sh
npm run clean
```

#### Database Setup

```
createdb --username postgres -E UTF-8 -T template0 --no-password --locale C financials
knex migrate:make --env development --knexfile ./src/knexfile.ts financials
```

## Modules

### Company

(todo)

### Discounted Cash Flow

(todo)

### Feeds

[README](src/server/feeds/README.md)

### Indicators

[README](src/indicators/README.md)

### Options

(todo)

### Shared

(todo)



