import * as http from 'http';
import * as _ from 'lodash';

export class HttpFetchStream {

  constructor(public host: string, public path: string, public headers?: { [key: string]: string }) {
  }

  public get = (callback?: Function) => {
    console.log(`Calling ${this.host}${this.path}`);
    const options = {
      headers: this.headers,
      host: this.host,
      port: 80,
      path: this.path,
      method: 'GET'
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
  };

  public onResponse = (res: http.IncomingMessage, callback?: Function) => {
    if(_.isFunction(callback)) {
      res.on('finish', callback);
    }
  }
}
