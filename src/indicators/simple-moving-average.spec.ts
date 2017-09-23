import * as fs from 'fs';

import {average} from '../math';
import {simpleMovingAverage} from './simple-moving-average';

describe('FUNCTION: simpleMovingAverage', () => {
  const mock = JSON.parse(fs.readFileSync('src/indicators/simple-moving-average.mock.json', 'utf8'));

  it('should calculate a 10 day moving average', () => {
    let averages = simpleMovingAverage(mock, 10);

    expect(averages.length).toEqual(mock.length - 9);
    expect(averages[0].x).toEqual(mock[9].x);
    expect(averages[0].y).toEqual(average(mock.slice(0, 10), m => m.y));
    expect(averages[1].x).toEqual(mock[10].x);
    expect(averages[1].y).toEqual(average(mock.slice(1, 11), m => m.y));
    expect(averages[2].x).toEqual(mock[11].x);
    expect(averages[2].y).toEqual(average(mock.slice(2, 12), m => m.y));
    expect(averages[3].x).toEqual(mock[12].x);
    expect(averages[3].y).toEqual(average(mock.slice(3, 13), m => m.y));
    expect(averages[4].x).toEqual(mock[13].x);
    expect(averages[4].y).toEqual(average(mock.slice(4, 14), m => m.y));
    expect(averages[5].x).toEqual(mock[14].x);
    expect(averages[5].y).toEqual(average(mock.slice(5, 15), m => m.y));
  });

  it('should throw an error if period is greater than the number of data points', () => {
    expect(function() {
      return simpleMovingAverage(mock, mock.length + 1);
    }).toThrowError(/Not enough data\./);
  });

  it('should throw an error if values is null or undefined', () => {
    expect(function() {
      return simpleMovingAverage(null, 10);
    }).toThrowError(/Not enough data\./);

    expect(function() {
      return simpleMovingAverage(undefined, 10);
    }).toThrowError(/Not enough data\./);
  });
});
