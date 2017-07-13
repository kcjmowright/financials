import * as http from 'http';
import * as _ from 'lodash';

export class HttpFetchStream {

  /**
   *
   * @param {string} host
   * @param {string} path
   * @param {*} [headers] Optional HTTP headers object.
   * @constructor
   */
  constructor(public host: string, public path: string, public headers?: { [key: string]: string }) {
  }

  /**
   * Performs an HTTP request.
   * @param {Function} [callback] Optional callback function invoked on 'finish'.
   */
  public get = (callback?: Function) => {
    console.log(`Calling ${this.host}${this.path}`);
    const options = {
      headers: this.headers,
      host: this.host,
      method: 'GET',
      path: this.path,
      port: 80
    };
    const req = http.request(options, (res: http.IncomingMessage) => {
      this.onResponse(res, callback);
    });

    req.on('error', (e) => {
      console.error(e);
      if(_.isFunction(callback)) {
        callback(e);
      }
    });
    req.end();
  }

  /**
   * Method is intended to be overridden by subclasses and is invoked on response to an HTTP request.
   * @param {IncomingMessage} res response stream.
   * @param {Function} [callback] Optional callback function invoked on 'finish'.
   */
  public onResponse = (res: http.IncomingMessage, callback?: Function) => {
    if(_.isFunction(callback)) {
      res.on('finish', callback);
    }
  }
}
