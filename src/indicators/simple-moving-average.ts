import {average} from '../math';

export class SimpleMovingAverage {
  public averages: { average: number, date: Date }[];

  constructor(dates: Date[], price: number[], public period: number = 20) {
    if(price.length < period) {
      throw new Error('Not enough data.');
    }
    if(dates.length !== price.length) {
      throw new Error('Date and price data points are unequal in length.');
    }

    this.averages = [];
    let startIdx = 0;
    let endIdx = period;

    while(endIdx < price.length) {
      this.averages.push({
        average: average(price.slice(startIdx, endIdx)),
        date: dates[endIdx - 1]
      });
      startIdx++;
      endIdx++;
    }
  }
}
