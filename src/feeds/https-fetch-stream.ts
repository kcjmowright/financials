import * as https from 'https';
import * as _ from 'lodash';

export class HttpsFetchStream {

  constructor(public host: string, public path: string) {
  }

  public get = (callback?: Function) => {
    const options = {
      host: this.host,
      port: 443,
      path: this.path,
      method: 'GET'
    };
    const req = https.request(options, (res: https.IncomingMessage) => {
      this.onResponse(res, callback);
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  };

  public onResponse = (res: https.IncomingMessage, callback?: Function) => {
    if(_.isFunction(callback)) {
      res.on('end', callback);
    }
  }
}
