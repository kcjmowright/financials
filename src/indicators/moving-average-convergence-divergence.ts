import {ExponentialMovingAverage} from './exponential-moving-average';
import {Line} from '../math';

/**
 *
 */
export class MovingAverageConvergenceDivergence {
  public values: {
    date: Date,
    distance: number,
    histogram?: number,
    longEMA: number,
    macd: number,
    macdSlope: number,
    shortEMA: number,
    signal?: number,
    value: number,
    valueSlope: number
  }[];
  public signalLineCrossovers: { date: Date, bullish: boolean }[];
  public centerLineCrossovers: { date: Date, bullish: boolean }[];

  /**
   *
   * @param {Date[]} dates
   * @param {number[]} values
   * @param {number} longPeriod
   * @param {number} shortPeriod
   * @param {number} signalPeriod
   */
  constructor(dates: Date[], values: number[], public longPeriod: number = 26, public shortPeriod: number = 12,
              public signalPeriod: number = 9) {
    if(shortPeriod >= longPeriod) {
      throw new Error('Shorter ema period is greater than the longer EMA period.');
    }
    if (dates.length !== values.length) {
      throw new Error('Date and value data points are unequal in length.');
    }
    let longEMA = new ExponentialMovingAverage(dates, values, longPeriod).averages;
    let shortEMA = new ExponentialMovingAverage(dates, values, shortPeriod).averages.slice(longPeriod - shortPeriod);
    let prevMacd = shortEMA[0].average - longEMA[0].average;
    let prevValue = values[0];

    this.signalLineCrossovers = [];
    this.centerLineCrossovers = [];
    this.values = longEMA.map((avgLonger, idx) => {
      let macd = shortEMA[idx].average - avgLonger.average;
      let value = avgLonger.value;
      let dist = new Line(0, macd, 0, value);
      let macdSlope = new Line(0, prevMacd, 1, macd);
      let valueSlope = new Line(0, prevValue, 1, value);

      prevMacd = macd;
      prevValue = value;
      return {
        date: new Date(avgLonger.date.getTime()),
        distance: dist.length(),
        histogram: undefined,
        longEMA: avgLonger.average,
        macd: macd,
        macdSlope: macdSlope.slope(),
        shortEMA: shortEMA[idx].average,
        signal: undefined,
        value: value,
        valueSlope: valueSlope.slope()
      };
    });
    let prevAboveSignal = null;
    let prevAboveCenter = null;
    let signalLine = new ExponentialMovingAverage(this.values.map(v => v.date), this.values.map(v => v.macd), signalPeriod).averages;

    signalLine.forEach((signalValue, idx) => {
      let value = this.values[idx + signalPeriod - 1];
      let aboveSignal;
      let aboveCenter;

      value.signal = signalValue.average;
      value.histogram = value.macd - signalValue.average;
      aboveSignal = value.macd > value.signal;
      aboveCenter = value.macd > 0;
      if(prevAboveSignal !== null) {
        if(prevAboveSignal !== aboveSignal) {
          this.signalLineCrossovers.push({
            bullish: aboveSignal,
            date: value.date
          });
        }
        if(prevAboveCenter !== aboveCenter) {
          this.centerLineCrossovers.push({
            bullish: aboveCenter,
            date: value.date
          });
        }
      }
      prevAboveSignal = aboveSignal;
      prevAboveCenter = aboveCenter;
    });
  }
}
