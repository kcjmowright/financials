import {ServerRegistrations} from './server-registrations';

/**
 *
 * @param {string} plugin name of the plugin
 * @param {*} options
 * @return {(target:any, propertyKey:string)=>void}
 */
export default function Route(plugin: string, options: { method: string | string[]; path: string; config?: any; }) {
  return function Route(target: any, propertyKey: string): void {
    ServerRegistrations.setRegistration(plugin, {
      method: options.method,
      path: options.path,
      handler: target[propertyKey],
      config: options.config
    });
  }
}