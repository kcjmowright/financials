import * as https from 'https';
import * as process from 'process';

export class HttpsFetchStream {

  constructor(public host: string, public path: string) {
  }

  public get = () => {
    const options = {
      host: this.host,
      port: 443,
      path: this.path,
      method: 'GET'
    };
    const req = https.request(options, (res) => this.onResponse);

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  };

  public onResponse = (res) => res.on('data', d => process.stdout.write(d));
}
