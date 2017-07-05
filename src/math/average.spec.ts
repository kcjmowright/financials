import {average} from './average';

describe('Function: average', function() {

  it('should calculate average of a set of numbers', function() {
    expect(average([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ])).toEqual(5);
  });

  it('should return undefined if given an empty set', function() {
    expect(average([])).not.toBeDefined();
  });

  it('should return itself if given a single number', function() {
    expect(average(13)).toEqual(13);
  });

  it('should return undefined if given undefined or null', function() {
    expect(average(undefined)).not.toBeDefined();
    expect(average(null)).not.toBeDefined();
  });
});
