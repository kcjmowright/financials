import * as fs from 'fs';
import {average} from '../math';
import {DateUtil} from '../shared';
import {ExponentialMovingAverage} from './exponential-moving-average';

describe('ExponentialMovingAverage', () => {
  const smaMock = JSON.parse(fs.readFileSync('src/indicators/exponential-moving-average.mock.json', 'utf8'));

  smaMock.dates = smaMock.dates.map(dateStr => DateUtil.toDate(dateStr));

  it('should calculate a 10 day exponential moving average', () => {
    let ema = new ExponentialMovingAverage(smaMock.dates, smaMock.prices, 10);

    expect(ema.period).toEqual(10);
    expect(ema.averages[0].date).toEqual(smaMock.dates[9]);
    expect(ema.averages[0].average).toEqual(average(smaMock.prices.slice(0, 10)));
  });

  it('should throw an error if period is greater than the number of data points', () => {
    expect(function() {
      new ExponentialMovingAverage(smaMock.dates, smaMock.prices, smaMock.dates.length + 1);
    }).toThrowError(/Not enough data\./);
  });

  it('should throw and error if dates and values data points length do NOT match', () => {
    expect(function() {
      new ExponentialMovingAverage(smaMock.dates.slice(0, 5), smaMock.prices, 10);
    }).toThrowError(/Date and value data points are unequal in length\./);
  });
});
