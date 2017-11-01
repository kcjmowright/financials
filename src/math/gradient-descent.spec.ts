import * as parse from 'csv-parse/lib/sync';
import * as fs from 'fs';

import {Point} from './point';
import {gradientDescentError} from './gradient-descent-error';
import {gradientDescent} from './gradient-descent';

describe('', function() {
  let points: Point[];

  beforeAll(() => {
    let data = fs.readFileSync('./src/math/gradient-descent.mock.csv', {
      encoding: 'utf8'
    });

    points = parse(data, {
      auto_parse: true,
      auto_parse_date: false,
      columns: true,
      relax_column_count: false,
      trim: true
    });
  });

  it('should calculate the best fitting line', () => {
    let learningRate = 0.0001;
    let initialB = 0; // initial y-intercept guess
    let initialM = 0; // initial slope guess
    let iterations = 1000;

    // console.log(`Starting gradient descent at:
    //   b = ${initialB},
    //   m = ${initialM},
    //   error = ${gradientDescentError(initialB, initialM, points)}`);
    // console.log('Running...');

    let [b, m] = gradientDescent(points, initialB, initialM, iterations, learningRate);

    // console.log(`After ${iterations} iterations:
    //   b = ${b},
    //   m = ${m},
    //   error = ${gradientDescentError(b, m, points)}`);
    expect(b).toEqual(0.08893651993741346);
    expect(m).toEqual(1.4777440851894448);
    expect(gradientDescentError(b, m, points)).toEqual(112.61481011613473);
  });

});
