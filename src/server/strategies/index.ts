import {ServerRegistrations} from '../server-registrations';
import {StrategiesResource} from './strategies-resource';

/**
 * Registers endpoints for this HAPI plugin.
 * @param {*} server
 * @param {*} options
 * @param {Function} next
 */
export function register(server, options, next) {
  ServerRegistrations.register(server, [
    StrategiesResource
  ]);
  next();
}

export namespace register {
  export const attributes = {
    name: 'strategies',
    version: '1.0.0'
  };
}
