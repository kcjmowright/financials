import {variance} from './variance';

describe('FUNCTION: variance', function() {
  it('should calculate the variance for a given set of numbers', function() {
    expect(variance([
      3,
      5,
      8,
      10
    ])).toEqual( 7.25);
  });

  it('should calculate the variance for a given set of objects', function() {
    expect(variance([
      { x: 0, y: 3 },
      { x: 1, y: 5 },
      { x: 2, y: 8 },
      { x: 3, y: 10 }
    ], v => v.y)).toEqual( 7.25);
  });

  it('should return undefined for an empty set of numbers', function() {
    expect(variance([])).not.toBeDefined();
  });

  it('should return undefined if given undefined or null', function() {
    expect(variance(undefined)).not.toBeDefined();
    expect(variance(null)).not.toBeDefined();
  });

  it('should return undefined if given an object array without a callback',
    () => expect(variance([{x: 0, y: 1}])).not.toBeDefined());

  it('should return variance of 0 for a single given value', () => {
    expect(variance(2)).toEqual(0);
  });
});
