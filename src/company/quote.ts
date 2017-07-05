export class Quote {
  id?: number;
  ticker: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  changed: number;
  changep: number;
  adjclose: number;
  tradeval: number;
  tradevol: number;

  /**
   *
   * @param options
   * @return {Quote}
   */
  public static newInstance(options: any): Quote {
    let quote = new Quote();

    quote.id = options.id;
    quote.ticker = options.ticker;
    quote.date = options.date;
    quote.open = options.open;
    quote.high = options.high;
    quote.low = options.low;
    quote.close = options.close;
    quote.volume = options.volume;
    quote.changed = options.changed;
    quote.changep = options.changep;
    quote.adjclose = options.adjclose;
    quote.tradeval = options.tradeval;
    quote.tradevol = options.tradevol;
    return quote;
  }
}
