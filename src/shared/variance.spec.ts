import {variance} from './variance';

describe('Function: variance', function() {
  it('should calculate the variance for a given set of numbers', function() {
    expect(variance([
      3,
      5,
      8,
      10
    ])).toEqual( 7.25);
  });

  it('should return undefined for an empty set of numbers', function() {
    expect(variance([])).not.toBeDefined();
  });

  it('should return undefined if given undefined or null', function() {
    expect(variance(undefined)).not.toBeDefined();
    expect(variance(null)).not.toBeDefined();
  });
});
