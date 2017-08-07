import {Point} from './point';
import * as _ from 'lodash';

/**
 * A line representation.
 */
export class Line {
  public a: Point;
  public b: Point;

  /**
   *
   * @param {Point | number } a
   * @param {Point | number } b
   * @param {number} [c]
   * @param {number} [d]
   * @constructor
   */
  constructor(a: Point | number, b: Point | number, c?: number, d?: number) {
    if(arguments.length === 4 && !!_.every(arguments, arg => typeof arg === 'number')) {
      this.a = new Point(<number>a, <number>b);
      this.b = new Point(c, d);
    } else if(arguments.length === 2 && arguments[0] instanceof Point && arguments[1] instanceof Point) {
      this.a = <Point>a;
      this.b = <Point>b;
    } else {
      throw new Error('Unexpected arguments');
    }
  }

  /**
   * Calculates the slope of this line.
   * (y2 - y1) / (x2 - x1);
   * @return {number}
   */
  public slope(): number {
    return ( this.b.y - this.a.y ) / ( this.b.x - this.a.x );
  }

  /**
   * Calculates the length (distance) of this line.
   * sqrt( (x2 - x1)^2 + (y2 - y1)^2 )
   * @return {number}
   */
  public length(): number {
    return Math.sqrt(Math.pow(this.b.x - this.a.x, 2) + Math.pow(this.b.y - this.a.y, 2));
  }

  /**
   * Get the y intercept of `this` line.
   * @return {number} the y intercept.
   */
  public getYIntercept(): number {
    return this.a.y - (this.slope() * this.a.x);
  }

  /**
   *
   * @param line the other line to compare to this line.
   * @return {{a: number, b: number, c: number, d: number, isIdentical: boolean, isParallel: boolean, x: any, y: any}}
   * - a this line's slope.
   * - b other line's slope.
   * - c this line's y intercept.
   * - d other line's y intercept.
   * - isIdentical,
   * - isParallel,
   * - x the x value of intersection.
   * - y the y value of intersection.
   */
  public compareTo(line: Line): any {
    let a = this.slope();
    let c = this.getYIntercept();
    let b = line.slope();
    let d = line.getYIntercept();
    let isParallel = a === b;
    let isIdentical = isParallel && c === d;
    let x;
    let y;

    if(!isParallel) {
      x = (d - c ) / (a - b);
      y = (a * d - b * c) / (a - b);
    }
    return {
      a: a, // this line's slope.
      b: b, // other line's slope.
      c: c, // this line's y intercept.
      d: d, // other line's y intercept.
      isIdentical: isIdentical,
      isParallel: isParallel,
      x: x, // x value of intersection.
      y: y // y value of intersection.
    };
  }

}
