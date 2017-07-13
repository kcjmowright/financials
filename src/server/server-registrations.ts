/**
 * Works with the Route decorator to register endpoints for the HAPI server.
 */
export class ServerRegistrations {
  static store = {};

  /**
   *
   * @param {Function} plugin
   * @param {*} options
   */
  static setRegistration(plugin: Function, options: {
    config?: any;
    handler: Function;
    method: string | string[];
    path: string;
  }) {
    /* tslint:disable no-string-literal */
    if(!ServerRegistrations.store[plugin['name']]) {
      ServerRegistrations.store[plugin['name']] = [];
    }
    ServerRegistrations.store[plugin['name']].push(options);
    /* tslint:enable no-string-literal */
  }

  /**
   *
   * @param {*} server
   * @param {*} classes
   */
  static register(server: any, classes: any[]) {
    classes.forEach(clazz => {
      /* tslint:disable no-string-literal */
      ServerRegistrations.store[clazz['name']].forEach(config => {
        console.log(`Registering path ${config.method} ${config.path}`);
        server.route(config);
      });
      /* tslint:enable no-string-literal */
    });
  }
}
