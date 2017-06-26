export class ServerRegistrations {
  static store = {};

  static setRegistration(plugin: string, options: {
    config?: any;
    handler: Function;
    method: string | string[];
    path: string;
  }): void {
    if(!ServerRegistrations.store[plugin]) {
      ServerRegistrations.store[plugin] = [];
    }
    ServerRegistrations.store[plugin].push(options);
  }

  /**
   *
   * @param pluginName
   * @param server
   * @param classes
   */
  static register(pluginName: string, server: any, classes: any[]): void {
    ServerRegistrations.store[pluginName].forEach(config => {
      console.info(`Registering path ${config.method} ${config.path}`);
      server.route(config);
    })
  }
}
