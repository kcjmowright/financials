import {Line} from './line';
import {Point} from './point';

describe('Line', () => {

  it('should allow 2 Point instances to be passed to the constructor', () => {
    let line = new Line(new Point(0, 1), new Point(1, 2));

    expect(line).toBeDefined();
    expect(line.a instanceof Point).toBe(true);
    expect(line.b instanceof Point).toBe(true);
    expect(line.a.x).toBe(0);
    expect(line.a.y).toBe(1);
    expect(line.b.x).toBe(1);
    expect(line.b.y).toBe(2);
  });

  it('should allow 4 numbers to be passed to the constructor', () => {
    let line = new Line(0, 1, 1, 2);

    expect(line).toBeDefined();
    expect(line.a instanceof Point).toBe(true);
    expect(line.b instanceof Point).toBe(true);
    expect(line.a.x).toBe(0);
    expect(line.a.y).toBe(1);
    expect(line.b.x).toBe(1);
    expect(line.b.y).toBe(2);
  });

  it('should throw and error if the wrong number or type of arguments are passed', () => {
    expect(function() {
      return new Line(0, 1, 2);
    }).toThrowError(/Unexpected arguments/);
    expect(function() {
      return new Line(new Point(0, 1), 1, 2);
    }).toThrowError(/Unexpected arguments/);
    expect(function() {
      return new Line(new Point(0, 1), new Point(0, 1), 2);
    }).toThrowError(/Unexpected arguments/);
    expect(function() {
      return new Line(new Point(0, 1), new Point(0, 1), 2, 3);
    }).toThrowError(/Unexpected arguments/);
    expect(function() {
      return new Line(1, new Point(0, 1), 2, 3);
    }).toThrowError(/Unexpected arguments/);
  });

  it('should calculate the slope', () => {
    let line1 = new Line(3, 1, 5, 6);

    expect(line1.slope()).toBe(2.5);

    let line2 = new Line(3, 2, 5, 8);

    expect(line2.slope()).toBe(3);
  });

  it('should calculate the length', () => {
    let line1 = new Line(3, 1, 5, 6);

    expect(line1.length()).toBe(5.385164807134504);

    let line2 = new Line(3, 2, 5, 8);

    expect(line2.length()).toBe(6.324555320336759);
  });

  it('should compare two non identical and non parallel lines', () => {
    let line1 = new Line(3, 1, 5, 6);
    let line2 = new Line(3, 2, 5, 8);
    let comparison = line1.compareTo(line2);

    expect(comparison).toEqual({
      aSlope: 2.5,
      aYIntercept: -6.5,
      bSlope: 3,
      bYIntercept: -7,
      intercept: new Point(1, -4),
      isIdentical: false,
      isParallel: false
    });
  });

  it('should compare two identical lines', () => {
    let line1 = new Line(3, 1, 5, 6);
    let line2 = new Line(3, 1, 5, 6);
    let comparison = line1.compareTo(line2);

    expect(comparison).toEqual({
      aSlope: 2.5,
      aYIntercept: -6.5,
      bSlope: 2.5,
      bYIntercept: -6.5,
      intercept: undefined,
      isIdentical: true,
      isParallel: true
    });
  });

  it('should compare two parallel but not identical lines', () => {
    let line1 = new Line(3, 1, 5, 6);
    let line2 = new Line(4, 2, 6, 7);
    let comparison = line1.compareTo(line2);

    expect(comparison).toEqual({
      aSlope: 2.5,
      aYIntercept: -6.5,
      bSlope: 2.5,
      bYIntercept: -8,
      intercept: undefined,
      isIdentical: false,
      isParallel: true
    });
  });

  it('should provide the lines function', () => {
    let line1 = new Line(13, 11, 15, 26);
    let fn = line1.getSlopeInterceptFn();

    expect(fn(13)).toEqual(11);
    expect(fn(14)).toEqual(18.5);
    expect(fn(15)).toEqual(26);
  });
});
