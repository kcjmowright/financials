import {RsiResource} from './rsi-resource';
import {ServerRegistrations} from '../server-registrations';

/**
 *
 * @param server
 * @param options
 * @param next
 */
export function register(server, options, next): void {
  ServerRegistrations.register(server, [
    RsiResource
  ]);
  next();
}

export namespace register {
  export const attributes = {
    name: 'indicators',
    version: '1.0.0'
  }
}

