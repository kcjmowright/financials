import * as fs from 'fs';

export const config = JSON.parse(fs.readFileSync('./config/manifest.json', 'utf8'));
