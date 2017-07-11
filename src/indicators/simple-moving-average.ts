import {average} from '../math';

export class SimpleMovingAverage {
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

    while(endIdx <= values.length) {
      this.averages.push({
        average: average(values.slice(startIdx, endIdx)),
        date: dates[endIdx - 1]
      });
      startIdx++;
      endIdx++;
    }
  }
}
