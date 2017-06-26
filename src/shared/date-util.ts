import * as moment from 'moment';

export class DateUtil {

  public static ISO_DATETIME_FORMAT = "YYYY-MM-DDTkk:mm:ssZZ";
  public static ISO_DATE_FORMAT = "YYYY-MM-DD";

  /**
   *
   * @param date
   * @return {string}
   */
  public static toISODateString(date: Date): string {
    return moment(date).format(DateUtil.ISO_DATE_FORMAT);
  }

  /**
   *
   * @param date
   * @return {string}
   */
  public static toISODateTimeString(date: Date): string {
    return moment(date).format(DateUtil.ISO_DATETIME_FORMAT);
  }

  /**
   *
   * @param dateStr
   * @return {Date}
   */
  public static toDate(dateStr: string): Date {
    return moment(dateStr, DateUtil.ISO_DATE_FORMAT).set({
      hour: 0,
      minute: 0,
      second: 0
    }).toDate();
  }

  /**
   *
   * @param dateStr
   * @return {Date}
   */
  public static toDateTime(dateStr: string): Date {
    return moment(dateStr, DateUtil.ISO_DATETIME_FORMAT).toDate();
  }
}
