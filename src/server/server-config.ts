import * as fs from 'fs';
import * as process from 'process';

export const config = JSON.parse(fs.readFileSync('./config/manifest.json', 'utf8'));

config.connections.port = process.env.PORT || config.connections.port;
