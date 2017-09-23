import {linearLeastSquares} from './linear-least-squares';
import {Point} from './point';

/**
 * Check answers at https://cgwb.nci.nih.gov/cgwbreg.html
 */
describe('FUNCTION: linearLeastSquares', () => {

  it('should throw error if first argument is undefined or null or not an array', () => {
    expect(() => linearLeastSquares(undefined)).toThrowError();
    expect(() => linearLeastSquares(null)).toThrowError();
    expect(() => linearLeastSquares(<any>1)).toThrowError();
  });

  it('should throw error if first argument not an array of Points and the second argument is undefined', () => {
    expect(() => linearLeastSquares([1, 2, 3])).toThrowError();
  });

  it('should throw error the first array length does not equal second array length', () => {
    expect(() => linearLeastSquares([1, 2, 3], [1])).toThrowError();
  });

  it('should return undefined if arguments are empty arrays', () => {
    expect(linearLeastSquares([], [])).not.toBeDefined();
  });

  it('should find the best fitting line for the given arrays of numbers', () => {
    let x = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11
    ];
    let y = [
      23,
      15,
      20,
      32,
      17,
      33,
      21,
      41,
      20,
      23,
      46
    ];
    let result = linearLeastSquares(x, y);

    expect(result.line.getYIntercept()).toEqual(17.236363636363635);
    expect(result.line.slope()).toEqual(1.5363636363636364);
    expect(result.coefficientsOfDeterminationR2).toEqual(0.2533800567778567);
    expect(result.stdErrorOfEstimate).toEqual(9.220037467878909);
  });

  it('should find the best fitting line for the given set of points', () => {
    let points = [
      new Point(1, 23),
      new Point(2, 15),
      new Point(3, 20),
      new Point(4, 32),
      new Point(5, 17),
      new Point(6, 33),
      new Point(7, 21),
      new Point(8, 41),
      new Point(9, 20),
      new Point(10, 23),
      new Point(11, 46)
    ];
    let result = linearLeastSquares(points);

    expect(result.line.getYIntercept()).toEqual(17.236363636363635);
    expect(result.line.slope()).toEqual(1.5363636363636364);
    expect(result.coefficientsOfDeterminationR2).toEqual(0.2533800567778567);
    expect(result.stdErrorOfEstimate).toEqual(9.220037467878909);
  });
});
