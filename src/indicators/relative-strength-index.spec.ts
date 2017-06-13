import * as fs from 'fs';
import * as _ from 'lodash';

import {RelativeStrengthIndex} from './relative-strength-index';

describe('RSI', function() {

  const rsiMock = JSON.parse(fs.readFileSync('src/indicators/relative-strength-index.mock.json', 'utf8'));

  rsiMock.dates = rsiMock.dates.map(function(s) {
    return new Date(s + 'T21:30:00Z');
  });

  const rsiResult = JSON.parse(fs.readFileSync('src/indicators/relative-strength-index-result.mock.json', 'utf8'));

  rsiResult.forEach(function(result) {
    result.date = new Date(result.date + 'T21:30:00Z');
  });

  it('should calculate rsi with dates', function() {
    let rsi = new RelativeStrengthIndex(rsiMock.prices, rsiMock.dates, rsiMock.period);

    expect(rsi.values.length).toBe(19);
    expect(rsi.values).toEqual(rsiResult);
  });

  it('should handle smaller data set than the given period', function() {
    let rsi = new RelativeStrengthIndex(rsiMock.prices.slice(0, 13), rsiMock.dates.slice(0, 13), 14);

    expect(rsi.values.length).toBe(1);
  });

  it('should handle a lack of date data', function() {
    let rsi = new RelativeStrengthIndex(rsiMock.prices);

    expect(rsi.values.length).toBe(19);
    _.each(rsi.values, (v, i) => {
      expect(v.rsi).toEqual(rsiResult[i].rsi);
      expect(v.date).not.toBeDefined();
    });
  });

  it('should handle nothin but gains', function() {
    let rsi = new RelativeStrengthIndex([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ]);

    expect(rsi.values[0].rsi).toBe(100.0);
  });

  it('should handle nothin but losses', function() {
    let rsi = new RelativeStrengthIndex([
      14,
      13,
      12,
      11,
      10,
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1
    ]);

    expect(rsi.values[0].rsi).toBe(0.0);
  });

  it('should find bullish failure swings', function() {
    let rsiMock = JSON.parse(fs.readFileSync('src/indicators/relative-strength-bullish-failure-swing.mock.json', 'utf8'));

    rsiMock.dates = rsiMock.dates.map(function(s) {
      return new Date(s + 'T21:30:00Z');
    });

    let rsi = new RelativeStrengthIndex(rsiMock.prices, rsiMock.dates, rsiMock.period);
    let failureSwing = rsi.findFailureSwings();

    expect(failureSwing).toBeDefined();
    expect(failureSwing.length).toBeTruthy();
    expect(failureSwing[0].date.toISOString()).toBe('2010-01-26T21:30:00.000Z');
    expect(failureSwing[0].rsi).toBe(67.2733);
    expect(failureSwing[0].price).toBe(44.85);
    expect(failureSwing[0].bullish).toBe(true);
  });

  xit('should find bearish failure swings', function() {
    let rsiMock = JSON.parse(fs.readFileSync('src/indicators/relative-strength-bearish-failure-swing.mock.json', 'utf8'));

    rsiMock.dates = rsiMock.dates.map(function(s) {
      return new Date(s + 'T21:30:00Z');
    });

    let rsi = new RelativeStrengthIndex(rsiMock.prices, rsiMock.dates, rsiMock.period);
    let failureSwing = rsi.findFailureSwings();

    expect(failureSwing).toBeDefined();
    expect(failureSwing.length).toBeTruthy();
    expect(failureSwing[0].bullish).toBe(false);
    // expect(failureSwing[0].date.toISOString()).toBe('2010-01-26T21:30:00.000Z');
    // expect(failureSwing[0].rsi).toBe(67.2733);
    // expect(failureSwing[0].price).toBe(44.85);
  });

  xit('should be overbought', function() {

  });

  xit('should be oversold', function() {

  });

  xit('should find bullish divergences', function() {

  });

  xit('should find bearish divergences', function() {

  });

});
