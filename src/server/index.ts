import * as Glue from 'glue';
import {config} from './server-config';
import './db'; // <= Automatically configure database.

const options = {
  relativeTo: __dirname
};

/**
 * Starts the REST server.
 */
Glue.compose(config, options, (error, server) => {
  if(error) {
    console.log(error);
    return;
  }
  server.start((err) => {
    if(err) {
      console.log(err);
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});
