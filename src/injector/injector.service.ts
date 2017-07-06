import {IInjectable} from './iinjectable.interface';
export class Injector {
  private static injector: Injector;
  private classes: { [key: string]: new() => IInjectable } = {};
  private instances: { [key: string]: IInjectable } = {};

  constructor() {
    this.classes = {};
    this.instances = {};
  }

  public getInjectable(key: string): IInjectable {
    let inst = this.instances[key];

    if(!inst) {
      inst = new this.classes[key]();
      inst.$inject();
      this.instances[key] = inst;
    }
    return inst;
  }

  public set(key: string, value: new() => IInjectable) {
    this.classes[key] = value;
  }

  public static getInstance(): Injector {
    if(!Injector.injector) {
      Injector.injector = new Injector();
    }
    return Injector.injector;
  }
}
