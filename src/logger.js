/* global Rollbar */

import bunyan from 'bunyan';
import stdIOStream from './stdIOStream';

const logLevel = process.env.LOG_LEVEL || 'info';

function FrontEndLogger() {
  this.isFrontEnd = true;
  this.info = console.log.bind(console); // eslint-disable-line no-console
  this.error = function proxyError(...args) {
    if (typeof Rollbar !== 'undefined' && typeof Rollbar.error === 'function') {
      Rollbar.error(...args);
    }

    console.error(...args); // eslint-disable-line no-console
  };
  this.warn = function proxyWarn(...args) {
    if (typeof Rollbar !== 'undefined' && typeof Rollbar.warning === 'function') {
      Rollbar.warning(...args);
    }

    console.warn(...args); // eslint-disable-line no-console
  };
  this.trace = console.trace.bind(console); // eslint-disable-line no-console
}

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

  return bunyan.createLogger({
    name: runningScript,
    streams,
  });
}());
