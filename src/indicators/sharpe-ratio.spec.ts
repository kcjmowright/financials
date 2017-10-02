import {sharpeRatio} from './sharpe-ratio';
import * as fs from 'fs';

describe('FUNCTION: sharpeRatio', () => {

  let mock = JSON.parse(fs.readFileSync('./src/indicators/sharpe-ratio.mock.json', {
    encoding: 'utf8'
  })).map((v, idx, arr) => !idx ? 1 : v.y / arr[idx - 1].y - 1);

  it('should return undefined if values are undefined, null or length of series is zero', () => {
    expect(sharpeRatio(null)).not.toBeDefined();
    expect(sharpeRatio(undefined)).not.toBeDefined();
    expect(sharpeRatio([])).not.toBeDefined();
  });

  it('should return the Sharpe ratio for given series of numbers', () => {
    expect(sharpeRatio(mock)).toEqual(0.17176304458009942);
  });

  it('should scale the Sharpe ratio for given series', () => {
    expect(sharpeRatio(mock, 12)).toEqual(2.0611565349611927);
  });

  it('should adjust the Sharpe ratio for given series and risk free rate', () => {
    expect(sharpeRatio(mock, 1, 0.03)).toEqual(-0.002727800522990154);
  });
});
