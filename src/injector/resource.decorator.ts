export function Resource(pluginName: string) {
  return function(target: any): any {
    target.prototype.$$plugin = pluginName;
    return target;
  }
}
