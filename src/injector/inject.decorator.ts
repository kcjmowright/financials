import {IInjectable} from './iinjectable.interface';

export function Inject(injectionToken?: string) {
  return function Inject(target: any, propertyKey: string): void {
    if(!target.$$injectables) {
      target.$$injectables = [];
    }
    if(!injectionToken) {
      injectionToken = propertyKey
    }
    target.$$injectables[injectionToken] = propertyKey;
  }
}
