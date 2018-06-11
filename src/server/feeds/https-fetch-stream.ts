import {IncomingMessage} from 'http';
import * as https from 'https';
import * as _ from 'lodash';

export class HttpsFetchStream {

  /**
   *
   * @param {string} host
   * @param {string} path
   * @constructor
   */
  constructor(public host: string, public path: string) {
  }

  /**
   * Performs an HTTPS request.
   * @param {Function} [callback] Optional callback function invoked on 'finish'.
   */
  public get = (callback?: Function) => {
    console.log(`Calling ${this.host}${this.path}`);
    const options = {
      headers: {
        'User-Agent': 'curl/7.47.0'
      },
      host: this.host,
      method: 'GET',
      path: this.path,
      port: 443
    };
    const req = https.request(options, (res: IncomingMessage) => {
      console.log(res.statusCode);
      console.log(res.headers);
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
  public onResponse = (res: IncomingMessage, callback?: Function) => {
    if(_.isFunction(callback)) {
      res.on('finish', callback);
    }
  }
}
