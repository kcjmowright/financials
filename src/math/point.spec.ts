import {Point} from './point';

describe('CLASS: Point', () => {
  it('should compare 2 points', () => {
    let point1 = new Point(0, 2);
    let point2 = new Point(1, 3);
    let point3 = new Point(1, 3);

    expect(point1.isEqual(point2)).toBe(false);
    expect(point2.isEqual(point3)).toBe(true);
  });
});
