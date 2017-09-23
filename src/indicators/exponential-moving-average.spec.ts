import * as fs from 'fs';
import {average} from '../math';
import {exponentialMovingAverage} from './exponential-moving-average';

describe('FUNCTION: exponentialMovingAverage', () => {
  const mock = JSON.parse(fs.readFileSync('src/indicators/exponential-moving-average.mock.json', 'utf8'));

  it('should calculate a 10 day exponential moving average', () => {
    let averages = exponentialMovingAverage(mock, 10);

    expect(averages[0].x).toEqual(mock[9].x);
    expect(averages[0].y).toEqual(average(mock.slice(0, 10), m => m.y));
  });

  it('should throw an error if period is greater than the number of data points', () => {
    expect(function() {
      return exponentialMovingAverage(mock, mock.length + 1);
    }).toThrowError(/Not enough data\./);
  });

  it('should throw and error if `values` is null or undefined', () => {
    expect(function() {
      return exponentialMovingAverage(null, 10);
    }).toThrowError(/Not enough data\./);

    expect(function() {
      return exponentialMovingAverage(undefined, 10);
    }).toThrowError(/Not enough data\./);
  });
});
