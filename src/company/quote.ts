import {DateUtil} from '../shared/date-util';
import {Point} from '../math/point';

export class Quote extends Point {
  public id?: number;
  public ticker: string;
  // x: number;
  public open: number;
  public high: number;
  public low: number;
  // y: number;
  public volume: number;
  public changed: number;
  public changep: number;
  public adjclose: number;
  public tradeval: number;
  public tradevol: number;

  public getDate(): Date {
    return new Date(this.x);
  }

  public getPrice(): number {
    return this.y;
  }
  /**
   *
   * @param options
   * @return {Quote}
   */
  public static newInstance(options: any = {}): Quote {
    let quote = new Quote();

    quote.id = options.id;
    quote.ticker = options.ticker;
    if(typeof options.x === 'string') {
      quote.x = DateUtil.toDateTime(options.x).getTime();
    } else if(options.x instanceof Date) {
      quote.x = options.x.getTime();
    } else if(options.x === 'number') {
      quote.x = options.x;
    }
    quote.open = options.open;
    quote.high = options.high;
    quote.low = options.low;
    quote.y = options.y;
    quote.volume = options.volume;
    quote.changed = options.changed;
    quote.changep = options.changep;
    quote.adjclose = options.adjclose;
    quote.tradeval = options.tradeval;
    quote.tradevol = options.tradevol;
    return quote;
  }
}
