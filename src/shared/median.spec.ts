import {median} from './median';

describe('Function: median', function() {
  it('should return the median value of an odd length set of numbers', function() {
    expect(median([
      3,
      4,
      10
    ])).toEqual(4);
  });

  it('should return the median value of an even length set of numbers', function() {
    expect(median([
      3,
      4,
      8,
      10
    ])).toEqual(6);
  });

  it('should return undefined if given null or undefined', function() {
    expect(median(undefined)).not.toBeDefined();
    expect(median(null)).not.toBeDefined();
  });

  it('should return the same number if given only one number', function() {
    expect(median(5)).toEqual(5);
  });
});
