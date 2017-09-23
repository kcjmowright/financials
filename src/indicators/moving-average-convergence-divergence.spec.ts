import * as fs from 'fs';
import {MovingAverageConvergenceDivergence} from './moving-average-convergence-divergence';

describe('CLASS: MovingAverageConvergenceDivergence', () => {
  const macdMock = JSON.parse(fs.readFileSync('src/indicators/moving-average-convergence-divergence.mock.json', 'utf8'));

  it('should calculate macd', function() {
    let macd = new MovingAverageConvergenceDivergence(macdMock);

    expect(macd).toBeDefined();
    expect(macd.longPeriod).toBe(26);
    expect(macd.shortPeriod).toBe(12);
    expect(macd.signalPeriod).toBe(9);
    expect(macd.results.length).toBe(macdMock.length - macd.longPeriod + 1);

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

  it('should throw an error if `values` are null, undefined or length of `values` is 0', function() {
    expect(function() {
      return new MovingAverageConvergenceDivergence(null);
    }).toThrowError(/Not enough data/);

    expect(function() {
      return new MovingAverageConvergenceDivergence(undefined);
    }).toThrowError(/Not enough data/);

    expect(function() {
      return new MovingAverageConvergenceDivergence([]);
    }).toThrowError(/Not enough data/);
  });
});
