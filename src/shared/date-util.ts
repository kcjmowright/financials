import * as moment from 'moment';
import * as _ from 'lodash';

export class DateUtil {

  public static ISO_DATETIME_FORMAT = 'YYYY-MM-DDTkk:mm:ssZZ';
  public static ISO_DATE_FORMAT = 'YYYY-MM-DD';
  public static EN_US_DATE_FORMAT = 'MM/DD/YYYY';

  /**
   * Converts a Date instance to an ISO-8601 date string.
   * @param {Date} date
   * @return {string}
   */
  public static toISODateString(date: Date): string {
    if(_.isUndefined(date) || _.isNull(date) || isNaN(date.getTime())) {
      return undefined;
    }
    return moment(date).format(DateUtil.ISO_DATE_FORMAT);
  }

  /**
   * Converts a Date instance to an ISO-8601 datetime string.
   * @param {Date} date
   * @return {string}
   */
  public static toISODateTimeString(date: Date): string {
    if(_.isUndefined(date) || _.isNull(date) || isNaN(date.getTime())) {
      return undefined;
    }
    return moment(date).format(DateUtil.ISO_DATETIME_FORMAT);
  }

  /**
   * Converts an ISO-8601 date string to a Date instance.
   * @param {string} dateStr
   * @return {Date}
   */
  public static toDate(dateStr: string): Date {
    let parsed = moment(dateStr, [ DateUtil.ISO_DATE_FORMAT, DateUtil.EN_US_DATE_FORMAT ], true).set({
      hour: 0,
      minute: 0,
      second: 0
    });

    if(!parsed.isValid()) {
      return undefined;
    }
    return parsed.toDate();
  }

  /**
   * Converts an ISO-8601 datetime string to a Date instance.
   * @param {string} dateStr
   * @return {Date}
   */
  public static toDateTime(dateStr: string): Date {
    let parsed = moment(dateStr, [ DateUtil.ISO_DATETIME_FORMAT, DateUtil.EN_US_DATE_FORMAT ], true);

    if(!parsed.isValid()) {
      return undefined;
    }
    return parsed.toDate();
  }
}
