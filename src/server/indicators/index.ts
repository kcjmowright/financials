import {MacdResource} from './macd-resource';
import {RsiResource} from './rsi-resource';
import {ServerRegistrations} from '../server-registrations';

/**
 * Registers endpoints for this HAPI plugin.
 * @param {*} server
 * @param {*} options
 * @param {Function} next
 */
export function register(server, options, next) {
  ServerRegistrations.register(server, [
    MacdResource,
    RsiResource
  ]);
  next();
}

export namespace register {
  export const attributes = {
    name: 'indicators',
    version: '1.0.0'
  };
}
