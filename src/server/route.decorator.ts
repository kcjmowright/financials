import {ServerRegistrations} from './server-registrations';

/**
 *
 * @param {*} options
 * @return {(target:any, propertyKey:string)=>void}
 */
export default function Route(options: { method: string | string[]; path: string; config?: any; }) {
  return function Route(target: any, propertyKey: string): void {
    ServerRegistrations.setRegistration(target, {
      method: options.method,
      path: options.path,
      handler: target[propertyKey],
      config: options.config
    });
  }
}
