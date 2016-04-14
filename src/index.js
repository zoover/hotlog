import bunyan from 'bunyan';
import bunyanRequest from 'bunyan-request';
import fs from 'fs';
import stdIOStream from './stdIOStream';

const runningScript = require.main.filename.split('/').pop();
const rootDirPath = require.main.filename.split('/').slice(0, -1).join('/');
const logDirPath = `${rootDirPath}/log`;
const logFilePath = `${logDirPath}/${runningScript}.log`;
const streams = [];

try {
  const logDirStats = fs.statSync(logDirPath);
  if (logDirStats.isDirectory()) {
    // create file if not exists
    const fd = fs.openSync(logFilePath, 'a');
    fs.closeSync(fd);

    streams.push({
      level: 'info',
      path: logFilePath,
    });
  }
} catch (e) {
  console.log(e);
}

streams.push({
  level: 'info',
  stream: stdIOStream,
});

const logger = bunyan.createLogger({
  name: runningScript,
  streams,
});

export default logger;

export const requestLogger = bunyanRequest({
  logger,
  headerName: 'x-request-id',
});

export function ElasticsearchLogger(config) {
  logger.info(config, 'Create elasticsearch logger');
  this.error = logger.error.bind(logger);
  this.warning = logger.warn.bind(logger);
  this.info = logger.info.bind(logger);
  this.debug = logger.debug.bind(logger);
  this.trace = function trace(method, requestUrl, body, responseBody, responseStatus) {
    logger.trace({
      method,
      requestUrl,
      body,
      responseBody,
      responseStatus,
    });
  };
  // bunyan has no close
  this.close = function close() {};
}
