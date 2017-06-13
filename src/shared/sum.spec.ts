import {sum} from './sum';

describe('Function: sum', function() {

  it('should sum a set of numbers', function() {
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
    ])).toEqual(57.0);
  });

  it('should return the same number if given a single number', function() {
    expect(sum(-5.5)).toEqual(-5.5);
  });

  it('should return undefined if given undefined or null', function() {
    expect(sum(undefined)).not.toBeDefined();
    expect(sum(null)).not.toBeDefined();
  });

  it('should return undefined if given and empty set', function() {
    expect(sum([])).not.toBeDefined();
  });

});
