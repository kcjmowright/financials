import {average} from './average';

describe('FUNCTION: average', function() {

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

  it('should calculate average of a set of objects', function() {
    expect(average([
      { x: 0, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 9 }
    ], v => v.y)).toEqual(5);
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
