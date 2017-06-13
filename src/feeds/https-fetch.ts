import * as https from 'https';
import * as process from 'process';

export class HttpsFetch {

  constructor(public host: string, public path: string) {
  }

  public get = (callback?: Function) => {
    const options = {
      host: this.host,
      port: 443,
      path: this.path,
      method: 'GET'
    };
    const req = https.request(options, (res) => {
      res.on('data', this.onData);
      res.on('end', () => {
        this.onEnd(callback);
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  };

  public onData = (data) => {
    process.stdout.write(data);
  };

  public onEnd = (callback?: Function) => {};

}
