import {LinearRegressionResource} from './linear-regression-resource';
import {MacdResource} from './macd-resource';
import {RsiResource} from './rsi-resource';
import {ServerRegistrations} from '../server-registrations';
import {StochasticOscillatorResource} from './stochastic-oscillator-resource';

/**
 * Registers endpoints for this HAPI plugin.
 * @param {*} server
 * @param {*} options
 * @param {Function} next
 */
export function register(server, options, next) {
  ServerRegistrations.register(server, [
    LinearRegressionResource,
    MacdResource,
    RsiResource,
    StochasticOscillatorResource
  ]);
  next();
}

export namespace register {
  export const attributes = {
    name: 'indicators',
    version: '1.0.0'
  };
}
