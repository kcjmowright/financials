export class ServerRegistrations {
  static store = {};

  static setRegistration(plugin: Function, options: {
    config?: any;
    handler: Function;
    method: string | string[];
    path: string;
  }): void {
    if(!ServerRegistrations.store[plugin['name']]) {
      ServerRegistrations.store[plugin['name']] = [];
    }
    ServerRegistrations.store[plugin['name']].push(options);
  }

  /**
   *
   * @param server
   * @param classes
   */
  static register(server: any, classes: any[]): void {
    classes.forEach((clazz) => {
      ServerRegistrations.store[clazz['name']].forEach(config => {
        console.info(`Registering path ${config.method} ${config.path}`);
        server.route(config);
      })
    });
  }
}
