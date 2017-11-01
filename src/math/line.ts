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
    let xD = ( this.b.x - this.a.x );

    if(!xD) {
      return undefined;
    }
    return ( this.b.y - this.a.y ) / xD;
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
    let slope = this.slope();

    if(slope === undefined) {
      return undefined;
    }
    return this.a.y - (slope * this.a.x);
  }

  /**
   * Get the function that calculates y for the given x for this line.
   * @return {(x: number)=>number} Function for `this` line. ( y = m x + b )
   */
  public getSlopeInterceptFn(): Function {
    let m = this.slope();
    let b = this.getYIntercept();

    return (x: number) => m * x + b;
  }

  public toString() {
    return `y = ${this.slope()} * x + ${this.getYIntercept()}`;
  }
  /**
   *
   * @param {Line} line the other line to compare to this line.
   * @return {ILineComparison}
   */
  public compareTo(line: Line): ILineComparison {
    let aSlope = this.slope();
    let aYIntercept = this.getYIntercept();
    let bSlope = line.slope();
    let bYIntercept = line.getYIntercept();
    let isParallel = aSlope === bSlope;
    let isIdentical = isParallel && aYIntercept === bYIntercept;
    let x;
    let y;
    let intercept;

    if(!isParallel) {
      x = (bYIntercept - aYIntercept ) / (aSlope - bSlope);
      y = (aSlope * bYIntercept - bSlope * aYIntercept) / (aSlope - bSlope);
      intercept = new Point(x, y);
    }
    return {
      aSlope,
      aYIntercept,
      bSlope,
      bYIntercept,
      intercept,
      isIdentical,
      isParallel
    };
  }

  /**
   * Create a Line instance for a given slope and intercept and optional x inputs.
   * @param {number} m slope
   * @param {number} b y-intercept
   * @param {number} [x1=-100] optional x value.
   * @param {number} [x2=100] optional x value.
   * @return {Line}
   */
  public static newLine(m: number, b: number, x1: number = -100, x2: number = 100): Line {
    let fn = (x: number) => m * x + b;
    let p1 = new Point(x1, fn(x1));
    let p2 = new Point(x2, fn(x2));

    return new Line(p1, p2);
  }

}

/**
 * Describes the comparison of two lines.
 */
export interface ILineComparison {

  /**
   * This line's slope.
   */
  aSlope: number;

  /**
   * This line's y intercept.
   */
  aYIntercept: number;

  /**
   * Other line's slope.
   */
  bSlope: number;

  /**
   * Other line's y intercept.
   */
  bYIntercept: number;

  /**
   * Point of interception between two lines.
   */
  intercept?: Point;

  /**
   * Are these two lines the same?
   */
  isIdentical: boolean;

  /**
   * Are these two lines parallel?
   */
  isParallel: boolean;
}
