import {Interest} from './interest';

describe('CLASS: Interest', function() {

  it('should calculate compound interest', function() {
    expect(+Interest.compounded(100.0, 0.03, 1, 5).toFixed(4)).toEqual(15.9274);
  });

  it('should calculate future value', function() {
    expect(+Interest.futureValue(100.0, 0.03, 1, 5).toFixed(4)).toEqual(115.9274);
  });
});
