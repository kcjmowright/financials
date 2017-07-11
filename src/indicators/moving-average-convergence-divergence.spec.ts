import * as fs from 'fs';
import {DateUtil} from '../shared';
import {MovingAverageConvergenceDivergence} from './moving-average-convergence-divergence';

describe('MovingAverageConvergenceDivergence', () => {
  const macdMock = JSON.parse(fs.readFileSync('src/indicators/moving-average-convergence-divergence.mock.json', 'utf8'));

  beforeEach(function() {
    this.dates = macdMock.map(datum => DateUtil.toDateTime(datum.date));
    this.values = macdMock.map(datum => datum.value);
  });

  it('should calculate macd', function() {
    let macd = new MovingAverageConvergenceDivergence(this.dates, this.values);

    expect(macd).toBeDefined();
    expect(macd.longPeriod).toBe(26);
    expect(macd.shortPeriod).toBe(12);
    expect(macd.signalPeriod).toBe(9);
    expect(macd.values.length).toBe(this.dates.length - macd.longPeriod + 1);

    expect(macd.signalLineCrossovers[0].date).toEqual(new Date('2017-03-24T20:00:00.000Z'));
    expect(macd.signalLineCrossovers[0].bullish).toBe(true);
    expect(macd.signalLineCrossovers[1].date).toEqual(new Date('2017-04-18T20:00:00.000Z'));
    expect(macd.signalLineCrossovers[1].bullish).toBe(false);
    expect(macd.signalLineCrossovers[2].date).toEqual(new Date('2017-05-03T20:00:00.000Z'));
    expect(macd.signalLineCrossovers[2].bullish).toBe(true);

    expect(macd.centerLineCrossovers[0].date).toEqual(new Date('2017-04-04T20:00:00.000Z'));
    expect(macd.centerLineCrossovers[0].bullish).toBe(true);
    expect(macd.centerLineCrossovers[1].date).toEqual(new Date('2017-04-13T20:00:00.000Z'));
    expect(macd.centerLineCrossovers[1].bullish).toBe(false);
    expect(macd.centerLineCrossovers[2].date).toEqual(new Date('2017-05-11T20:00:00.000Z'));
    expect(macd.centerLineCrossovers[2].bullish).toBe(true);
  });

  it('should throw and error if dates and values data points length do NOT match', function() {
    let self = this;

    expect(function() {
      new MovingAverageConvergenceDivergence(self.dates.slice(0, 5), self.values);
    }).toThrowError(/Date and value data points are unequal in length\./);
  });
});
