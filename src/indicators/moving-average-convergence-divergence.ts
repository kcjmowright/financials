import {exponentialMovingAverage} from './exponential-moving-average';
import {Line, Point} from '../math';

/**
 *
 */
export class MovingAverageConvergenceDivergence {
  public results: {
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
   * @param {Point[]} values
   * @param {number} longPeriod
   * @param {number} shortPeriod
   * @param {number} signalPeriod
   */
  constructor(values: Point[], public longPeriod: number = 26, public shortPeriod: number = 12,
              public signalPeriod: number = 9) {
    if(!values || values.length === 0) {
      throw new Error('Not enough data');
    }
    if(shortPeriod >= longPeriod) {
      throw new Error('Shorter ema period is greater than the longer EMA period.');
    }
    let longEMA = exponentialMovingAverage(values, longPeriod);
    let shortEMA = exponentialMovingAverage(values, shortPeriod).slice(longPeriod - shortPeriod);
    let prevMacd = shortEMA[0].y - longEMA[0].y;
    let prevValue = values[0].y;

    this.signalLineCrossovers = [];
    this.centerLineCrossovers = [];
    this.results = longEMA.map((avgLonger, idx) => {
      let macd = shortEMA[idx].y - avgLonger.y;
      let value = values[longPeriod + idx - 1].y;
      let dist = new Line(0, macd, 0, value);
      let macdSlope = new Line(0, prevMacd, 1, macd);
      let valueSlope = new Line(0, prevValue, 1, value);

      prevMacd = macd;
      prevValue = value;
      return {
        date: new Date(avgLonger.x),
        distance: dist.length(),
        histogram: undefined,
        longEMA: avgLonger.y,
        macd: macd,
        macdSlope: macdSlope.slope(),
        shortEMA: shortEMA[idx].y,
        signal: undefined,
        value: value,
        valueSlope: valueSlope.slope()
      };
    });
    let prevAboveSignal = null;
    let prevAboveCenter = null;
    let signalLine = exponentialMovingAverage(this.results.map(v => new Point(v.date.getTime(), v.macd)), signalPeriod);

    signalLine.forEach((signalValue, idx) => {
      let value = this.results[idx + signalPeriod - 1];
      let aboveSignal;
      let aboveCenter;

      value.signal = signalValue.y;
      value.histogram = value.macd - signalValue.y;
      aboveSignal = value.macd > value.signal;
      aboveCenter = value.macd > 0;
      if(prevAboveSignal !== null) {
        if(prevAboveSignal !== aboveSignal) {
          this.signalLineCrossovers.push({
            bullish: aboveSignal,
            date: new Date(value.date)
          });
        }
        if(prevAboveCenter !== aboveCenter) {
          this.centerLineCrossovers.push({
            bullish: aboveCenter,
            date: new Date(value.date)
          });
        }
      }
      prevAboveSignal = aboveSignal;
      prevAboveCenter = aboveCenter;
    });
  }
}
