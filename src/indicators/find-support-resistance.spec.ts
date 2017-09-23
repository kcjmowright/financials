import * as fs from 'fs';
import {findSupportAndResistance} from './find-support-resistance';
import {DateUtil} from '../shared/date-util';

describe('FUNCTION: findSupportAndResistance', function() {

  beforeEach(function() {
    this.quotes = JSON.parse(fs.readFileSync('src/indicators/find-support-resistance.mock.json', 'utf8'));
    this.quotes.forEach(q => q.date = DateUtil.toDateTime(q.date));
  });

  xit('should', function() {
    let result = findSupportAndResistance(this.quotes);

    expect(result).toBeDefined();
  });

});
