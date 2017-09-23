import * as parse from 'csv-parse/lib/sync';
import * as fs from 'fs';

import {Quote} from '../company/quote';
import {StochasticOscillator} from './stochastic-oscillator';

describe('CLASS: StochasticOscillator', () => {
  const quotes: Quote[] = [];
  // idx, date, high, low, max, min, close, k, d
  const expected: any[] = [];

  beforeAll(() => {
    let data = fs.readFileSync('./src/indicators/stochastic-oscillator.spec.csv', {
      encoding: 'utf8'
    });
    let rows = parse(data, {
      auto_parse: true,
      auto_parse_date: false,
      columns: true,
      relax_column_count: true,
      trim: true
    });

    rows.forEach(row => {
      let quote = new Quote();

      quote.x = row.date;
      quote.high = row.high;
      quote.low = row.low;
      quote.y = row.close;
      quotes.push(quote);
      expected.push(row);
    });
  });

  it('should set default values', () => {
    let stochasticOscillator = new StochasticOscillator();

    expect(stochasticOscillator.period).toBe(14);
    expect(stochasticOscillator.values).toEqual([]);
    expect(stochasticOscillator.quotes).toEqual([]);
  });

  it('should calculate a 14 day stochastic oscillator', () => {
    let stochasticOscillator = new StochasticOscillator(quotes);

    expect(stochasticOscillator.values.length).toEqual(expected.length - stochasticOscillator.period + 1);

    stochasticOscillator.values.forEach((value, idx) => {
      let expectedValue = expected[idx + stochasticOscillator.period - 1];

      if (!!expectedValue.d) {
        expect(value.d).toBe(expectedValue.d);
      }
      expect(value.k).toEqual(expectedValue.k);
      expect(value.date).toEqual(expectedValue.date);
    });
  });
});
