import {sum} from './sum';

describe('FUNCTION: sum', () => {

  it('should sum a set of numbers', () =>
    expect(sum([
      1.1,
      2.2,
      3.3,
      4.4,
      5,
      6.4,
      7.3,
      8.2,
      9.1,
      10
    ])).toEqual(57.0));

  it('should sum the square of the given set of numbers', () => expect(sum([
    1.1,
    2.2,
    3.3,
    4.4,
    5,
    6.4,
    7.3,
    8.2,
    9.1,
    10
  ], x => Math.pow(x, 2))).toEqual(
    (1.1 * 1.1) + (2.2 * 2.2) +
    (3.3 * 3.3) + (4.4 * 4.4) +
    (5 * 5) + (6.4 * 6.4) +
    (7.3 * 7.3) + (8.2 * 8.2) +
    (9.1 * 9.1) + (10 * 10)));

  it('should return the same number if given a single number', () => expect(sum(-5.5)).toEqual(-5.5));

  it('should return undefined if given undefined or null', () => {
    expect(sum(undefined)).not.toBeDefined();
    expect(sum(null)).not.toBeDefined();
  });

  it('should return undefined if given and empty set', () => expect(sum([])).not.toBeDefined());

  it('should return undefined if given an object array without a callback',
    () => expect(sum([{x: 0, y: 1}])).not.toBeDefined());

});
