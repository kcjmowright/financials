import {ServerRegistrations} from './server-registrations';

/**
 * Decorator used to configure HAPI endpoints.
 * @param {*} options
 * @return {(target:any, propertyKey:string)=>void}
 */
export default function Route(options: { method: string | string[]; path: string; config?: any; }) {
  return function RouteConfig(target: any, propertyKey: string): void {
    ServerRegistrations.setRegistration(target, {
      config: options.config,
      handler: target[propertyKey],
      method: options.method,
      path: options.path
    });
  };
}
