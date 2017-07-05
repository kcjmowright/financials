import {Point} from './point';

export class Line {

  constructor(public a: Point, public b: Point) {
  }

  public slope(): number {
    return ( this.b.y - this.a.y ) / ( this.b.x - this.a.x );
  }

  public length(): number {
    return Math.sqrt(Math.pow(this.b.x - this.a.x, 2) + Math.pow(this.b.y - this.a.y, 2));
  }
}
