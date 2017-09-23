import {median} from './median';

describe('FUNCTION: median', function() {
  it('should return the median value of an odd length set of numbers', function() {
    expect(median([
      3,
      4,
      10
    ])).toEqual(4);
  });

  it('should return the median value of an odd length set of objects', function() {
    expect(median([
      { x: 0, y: 3 },
      { x: 1, y: 4 },
      { x: 2, y: 10 }
    ], v => v.y)).toEqual(4);
  });

  it('should return the median value of an even length set of numbers', function() {
    expect(median([
      10,
      4,
      3,
      8
    ])).toEqual(6);
  });

  it('should return the median value of an even length set of numbers with some repeated numbers', function() {
    expect(median([
      10,
      4,
      3,
      8,
      10,
      8
    ])).toEqual(8);
  });

  it('should return the median value of an even length set of objects', function() {
    expect(median([
      { x: 0, y: 4 },
      { x: 2, y: 8 },
      { x: 0, y: 3 },
      { x: 0, y: 10 }
    ], v => v.y)).toEqual(6);
  });

  it('should return undefined if given is null, undefined or array length is 0', function() {
    expect(median(undefined)).not.toBeDefined();
    expect(median(null)).not.toBeDefined();
    expect(median([])).not.toBeDefined();
  });

  it('should return undefined if given an object array with no callback', function() {
    expect(median([{ x: 0, y: 0 }])).not.toBeDefined();
  });

  it('should return the same number if given only one number', function() {
    expect(median(5)).toEqual(5);
  });
});
