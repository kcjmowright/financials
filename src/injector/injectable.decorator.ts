import * as _ from 'lodash';
import {IInjectable} from './iinjectable.interface';
import {Injector} from './injector.service';

export function Injectable(key?: string) {
  return function Injectable<T extends { new(...args: any[]): {}}>(constructor: T): T {
    let args = constructor.toString().match(/\(\s*([^)]+?)\s*\)/);

    if(args && args.length) {
      args = args.slice(1);
    }
    let injectable: any = class Injectable extends constructor implements IInjectable {
      $inject() {
        _.each(injectable.$$injectables, (function(key) {
          this[key] = Injector.getInstance().getInjectable(key);
        }).bind(this));
      }
    };

    key = key || _.camelCase(constructor['name']);
    injectable.$$injectables = args;
    injectable.$$super = constructor.prototype;
    injectable.$$inject = key;

    Injector.getInstance().set(key, injectable);
    return injectable;
  }
}
