import * as fs from 'fs';
import {average} from '../math';
import {DateUtil} from '../shared';
import {SimpleMovingAverage} from './simple-moving-average';

describe('SimpleMovingAverage', () => {
  const smaMock = JSON.parse(fs.readFileSync('src/indicators/simple-moving-average.mock.json', 'utf8'));

  smaMock.dates = smaMock.dates.map(dateStr => DateUtil.toDate(dateStr));

  it('should calculate a 10 day moving average', () => {
    let sma = new SimpleMovingAverage(smaMock.dates, smaMock.prices, 10);

    expect(sma.period).toEqual(10);
    expect(sma.averages.length).toEqual(smaMock.dates.length - 9);
    expect(sma.averages[0].date).toEqual(smaMock.dates[9]);
    expect(sma.averages[0].average).toEqual(average(smaMock.prices.slice(0, 10)));
    expect(sma.averages[1].date).toEqual(smaMock.dates[10]);
    expect(sma.averages[1].average).toEqual(average(smaMock.prices.slice(1, 11)));
    expect(sma.averages[2].date).toEqual(smaMock.dates[11]);
    expect(sma.averages[2].average).toEqual(average(smaMock.prices.slice(2, 12)));
    expect(sma.averages[3].date).toEqual(smaMock.dates[12]);
    expect(sma.averages[3].average).toEqual(average(smaMock.prices.slice(3, 13)));
    expect(sma.averages[4].date).toEqual(smaMock.dates[13]);
    expect(sma.averages[4].average).toEqual(average(smaMock.prices.slice(4, 14)));
    expect(sma.averages[5].date).toEqual(smaMock.dates[14]);
    expect(sma.averages[5].average).toEqual(average(smaMock.prices.slice(5, 15)));
  });

  it('should throw an error if period is greater than the number of data points', () => {
    expect(function() {
      new SimpleMovingAverage(smaMock.dates, smaMock.prices, smaMock.dates.length + 1);
    }).toThrowError(/Not enough data\./);
  });

  it('should throw and error if dates and values data points length do NOT match', () => {
    expect(function() {
      new SimpleMovingAverage(smaMock.dates.slice(0, 5), smaMock.prices, 10);
    }).toThrowError(/Date and value data points are unequal in length\./);
  });
});
