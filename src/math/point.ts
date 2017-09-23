export class Point {
  constructor(public x: number = 0, public y: number = 0) {
  }

  public isEqual(point: Point) {
    return this.x === point.x && this.y === point.y;
  }
}
