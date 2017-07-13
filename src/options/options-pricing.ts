import {OptionType} from './option-type';

/**

 ​//  JavaScript adopted from Bernt Arne Odegaard's Financial Numerical Recipes
 //  http://finance.bi.no/~bernt/gcc_prog/algoritms/algoritms/algoritms.html
 //  by Steve Derezinski, CXWeb, Inc.  http://www.cxweb.com
 //  Copyright (C) 1998  Steve Derezinski, Bernt Arne Odegaard
 //
 //  This program is free software; you can redistribute it and/or
 //  modify it under the terms of the GNU General Public License
 //  as published by the Free Software Foundation.

 //  This program is distributed in the hope that it will be useful,
 //  but WITHOUT ANY WARRANTY; without even the implied warranty of
 //  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 //  GNU General Public License for more details.
 //  http://www.fsf.org/copyleft/gpl.html
*/
export class OptionsPricing {

  /**
   * Returns probability of occurring below and above target price.
   *
   * @param {number} price
   * @param {number} target
   * @param {number} days
   * @param {number} volatility
   * @return {[number,number]}
   */
  public static probability(price: number, target: number, days: number, volatility: number): number[] {

    let p = price;
    let q = target;
    let t = days / 365;
    let v = volatility;

    let vt = v * Math.sqrt(t);
    let lnpq = Math.log(q / p);

    let d1 = lnpq / vt;

    let y = Math.floor(1 / (1 + .2316419 * Math.abs(d1)) * 100000) / 100000;
    let z = Math.floor(.3989423 * Math.exp(-((d1 * d1) / 2)) * 100000) / 100000;
    let y5 = 1.330274 * Math.pow(y, 5);
    let y4 = 1.821256 * Math.pow(y, 4);
    let y3 = 1.781478 * Math.pow(y, 3);
    let y2 = 0.356538 * Math.pow(y, 2);
    let y1 = 0.3193815 * y;
    let x = 1 - z * (y5 - y4 + y3 - y2 + y1);
    x = Math.floor(x * 100000) / 100000;

    if (d1 < 0) {
      x = 1 - x;
    }

    let pbelow = Math.floor(x * 1000) / 10;
    let pabove = Math.floor((1 - x) * 1000) / 10;

    return [ pbelow, pabove ];
  }

  /**
   *
   * @param {number} price
   * @param {number} target
   * @param {number} days
   * @param {number} volatility
   * @return {number}
   */
  public static probabilityAbove(price: number, target: number, days: number, volatility: number): number {
    return OptionsPricing.probability(price, target, days, volatility)[1];
  }

  /**
   *
   * @param {number} price
   * @param {number} target
   * @param {number} days
   * @param {number} volatility
   * @return {number}
   */
  public static probabilityBelow(price: number, target: number, days: number, volatility: number): number {
    return OptionsPricing.probability(price, target, days, volatility)[0];
  }

  /**
   *
   * @param {number} z
   * @return {number}
   */
  public static ndist(z: number): number {
    return (1.0 / (Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z);
  }

  /**
   *
   * @param {number} z
   * @return {number}
   */
  public static distribution(z: number): number {
    let b1 = 0.31938153;
    let b2 = -0.356563782;
    let b3 = 1.781477937;
    let b4 = -1.821255978;
    let b5 = 1.330274429;
    let p = 0.2316419;
    let c2 = 0.3989423;
    let a = Math.abs(z);

    if (a > 6.0) {
      return 1.0;
    }
    let t = 1.0 / (1.0 + a * p);
    let b = c2 * Math.exp((-z) * (z / 2.0));
    let n = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;

    n = 1.0 - b * n;
    if (z < 0.0) {
      n = 1.0 - n;
    }
    return n;
  }

  /**
   *
   * @param {OptionType} optionType
   * @param {number} stockPrice
   * @param {number} strikePrice
   * @param {number} noRiskInterest
   * @param {number} volatility (1 std dev of stock price for (1 yr? 1 month?, you pick)
   * @param {number} timeToMaturity
   * @return {number}
   */
  public static blackScholes(optionType: OptionType, stockPrice: number, strikePrice: number, noRiskInterest: number,
                             volatility: number, timeToMaturity: number): number {
    let sqt = Math.sqrt(timeToMaturity);
    let nd2;  //N(d2), used often
    // let nd1;  //n(d1), also used often
    let ert;  //e(-rt), ditto
    let delta;  //The delta of the option
    let d1 = (Math.log(stockPrice / strikePrice) + noRiskInterest * timeToMaturity) / (volatility * sqt) + 0.5 * (volatility * sqt);
    let d2 = d1 - (volatility * sqt);

    if (optionType === OptionType.CALL) {
      delta = OptionsPricing.distribution(d1);
      nd2 = OptionsPricing.distribution(d2);
    } else { //put
      delta = -OptionsPricing.distribution(-d1);
      nd2 = -OptionsPricing.distribution(-d2);
    }

    ert = Math.exp(-noRiskInterest * timeToMaturity);

    // nd1 = OptionsPricing.ndist(d1);
    // let gamma = nd1 / (stockPrice * volatility * sqt);
    // let vega = stockPrice * sqt * nd1;
    // let theta = -(stockPrice * volatility * nd1) / (2 * sqt) - noRiskInterest * strikePrice * ert * nd2;
    // let rho = strikePrice * timeToMaturity * ert * nd2;

    return ( stockPrice * delta - strikePrice * ert * nd2);
  }

  /**
   *
   * @param {OptionType} optionType
   * @param {number} stockPrice
   * @param {number} strikePrice
   * @param {number} noRiskInterest
   * @param {number} timeToMaturity
   * @param {number} optionPrice
   * @return {number}
   * @throws {Error} if fails to converge
   */
  public static impliedVolatility(optionType: OptionType, stockPrice, strikePrice: number, noRiskInterest: number,
                                  timeToMaturity: number, optionPrice: number): number {
    let sqt = Math.sqrt(timeToMaturity);
    let MAX_ITER = 100;
    let ACC = 0.0001;
    let i = MAX_ITER;
    let sigma = (optionPrice / stockPrice) / (0.398 * sqt);

    for (; --i >= 0; ) {
      let price = OptionsPricing.blackScholes(optionType, stockPrice, strikePrice, noRiskInterest, sigma, timeToMaturity);
      let diff = optionPrice - price;

      if (Math.abs(diff) < ACC) {
        return sigma;
      }
      let d1 = (Math.log(stockPrice / strikePrice) + noRiskInterest * timeToMaturity) / (sigma * sqt) + 0.5 * sigma * sqt;
      let vega = stockPrice * sqt * OptionsPricing.ndist(d1);

      sigma = sigma + diff / vega;
    }
    throw new Error('Error, failed to converge');
  }

  /**
   *
   * @param {number} stockPrice
   * @param {number} strikePrice
   * @param {number} noRiskInterest
   * @param {number} timeToMaturity
   * @param {number} optionPrice
   * @return {number}
   */
  public static callImpliedVolatility(stockPrice: number, strikePrice: number, noRiskInterest: number,
                                      timeToMaturity: number, optionPrice: number): number {
    return OptionsPricing.impliedVolatility(OptionType.CALL, stockPrice, strikePrice, noRiskInterest / 100,
      timeToMaturity / 365, optionPrice);
  }

}
