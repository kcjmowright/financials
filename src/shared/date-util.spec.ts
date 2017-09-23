import {DateUtil} from './date-util';
import * as moment from 'moment';

describe('CLASS: DateUtil', () => {

  describe('Method: toISODateString', () => {
    it('should return undefined if date is undefined, null or isNaN', () => {
      expect(DateUtil.toISODateString(null)).not.toBeDefined();
      expect(DateUtil.toISODateString(undefined)).not.toBeDefined();

      let date: Date = <Date>{
        getTime: function() {
          return <any>'a';
        }
      };
      expect(DateUtil.toISODateString(date)).not.toBeDefined();
    });

    it('should return a ISO formatted date string for a given date', () => {
      let expected = moment().set({
        hour: 0,
        millisecond: 0,
        minute: 0,
        second: 0
      }).toDate();
      let result = DateUtil.toISODateString(expected);
      let date = moment(result).toDate();

      expect(result).toEqual(jasmine.stringMatching(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/));
      expect(date).toEqual(expected);
    });
  });

  describe('Method: toISODateTimeString', () => {
    it('should return undefined if date is undefined, null or isNaN', () => {
      expect(DateUtil.toISODateString(null)).not.toBeDefined();
      expect(DateUtil.toISODateString(undefined)).not.toBeDefined();

      let date: Date = <Date>{
        getTime: function() {
          return <any>'a';
        }
      };
      expect(DateUtil.toISODateTimeString(date)).not.toBeDefined();
    });

    it('should return a ISO formatted date time string for a given date', () => {
      let expected = moment().set({
        millisecond: 0
      }).toDate();
      let result = DateUtil.toISODateTimeString(expected);
      let date = moment(result).toDate();

      expect(result).toEqual(jasmine.stringMatching(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-2][0-9]:[0-5][0-9]:[0-5][0-9]-[0-9]{4}$/));
      expect(date).toEqual(expected);
    });
  });

  describe('Method: toDate', () => {
    it('should return undefined if input string is undefined, null or not a valid ISO-8601 date format', () => {
      expect(DateUtil.toDate(null)).not.toBeDefined();
      expect(DateUtil.toDate(undefined)).not.toBeDefined();
      expect(DateUtil.toDate('foo')).not.toBeDefined();
    });

    it('should convert an ISO-8601 date string to a Date instance', () => {
      let input = '2017-09-10';
      let expected = moment(input).set({
        hour: 0,
        millisecond: 0,
        minute: 0,
        second: 0
      }).toDate();
      let result = DateUtil.toDate(input);

      expect(result).toEqual(expected);
    });
  });

  describe('Method: toDateTime', () => {
    it('should return undefined if input string is undefined, null or is an invalid ISO-8601 date time string', () => {
      expect(DateUtil.toDateTime(null)).not.toBeDefined();
      expect(DateUtil.toDateTime(undefined)).not.toBeDefined();
      expect(DateUtil.toDateTime('foo')).not.toBeDefined();
    });

    it('should convert an ISO-8601 date time string to a Date instance', () => {
      let input = '2017-09-10T05:00:00-0500';
      let expected = moment(input).set({
        millisecond: 0
      }).toDate();
      let result = DateUtil.toDateTime(input);

      expect(result).toEqual(expected);
    });
  });
});
