import {average} from '../math';

export class ExponentialMovingAverage {
  public averages: { average: number, date: Date }[];

  constructor(dates: Date[], values: number[], public period: number = 20) {
    if(values.length < period) {
      throw new Error('Not enough data.');
    }
    if(dates.length !== values.length) {
      throw new Error('Date and value data points are unequal in length.');
    }

    this.averages = [];
    let startIdx = 0;
    let endIdx = period;
    let lambda =  2 / ( 1 + period );
    let ema;
    let previousEMA = average(values.slice(startIdx, endIdx)); // <= Initialize with SMA
    let avg;

    while(endIdx < values.length) {
      avg = average(values.slice(startIdx, endIdx));
      ema = ( avg * lambda ) + ( previousEMA * (1 - lambda));
      this.averages.push({
        average: ema,
        date: dates[endIdx - 1]
      });
      startIdx++;
      endIdx++;
      previousEMA = ema;
    }
  }
}
