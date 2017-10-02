import * as fs from 'fs';
import * as parse from 'csv-parse/lib/sync';

import {DateUtil} from '../shared';
import {JumpSignal} from './jump-signal';
import {MomentumSignal} from './momentum-signal';
import {Quote} from '../company';
import {StrategyRunner} from './strategy-runner';

describe('CLASS: StrategyRunner', () => {
  let quotes: Quote[];
  let expected;

  beforeAll(() => {
    let data = fs.readFileSync('./src/strategies/strategy-runner.spec.csv', {
      encoding: 'utf8'
    });
    quotes = parse(data, {
      auto_parse: true,
      auto_parse_date: false,
      columns: true,
      relax_column_count: true,
      trim: true
    }).map(row => Quote.newInstance({
      x: DateUtil.toDate(row.date),
      y: row.price
    }));
    expected = JSON.parse(fs.readFileSync('./src/strategies/strategy-runner-results.mock.json', {
      encoding: 'utf8'
    }));
  });

  it('should run a strategy', () => {
    let strategies = [
      new MomentumSignal(),
      new JumpSignal()
    ];
    let strategyRunner = new StrategyRunner(quotes, strategies);

    expect(strategyRunner.sharpeRatio.toFixed(2))
      .toEqual(expected.sharpeRatio.toFixed(2));
  });

});
