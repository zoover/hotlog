/* global Rollbar */

import bunyan from 'bunyan';
import stdIOStream from './stdIOStream';
import FrontEndLogger from './frontend';

const logLevel = process.env.LOG_LEVEL || 'info';

export default (function logger() {
  if (typeof window !== 'undefined') {
    return new FrontEndLogger();
  }
  const runningScript = require.main.filename.split('/').pop();
  const streams = [];

  streams.push({
    level: logLevel,
    stream: stdIOStream,
  });

  const bunyanLogger = bunyan.createLogger({
    name: runningScript,
    streams,
  });

  console.log(bunyanLogger);

  return bunyanLogger;

}());
