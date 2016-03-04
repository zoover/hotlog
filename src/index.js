import bunyan from 'bunyan';
import bunyanRequest from 'bunyan-request';
import fs from 'fs';

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
  stream: process.stdout,
});

const logger = bunyan.createLogger({
  name: runningScript,
  streams,
});

export default logger;

export const requestLoger = bunyanRequest({
  logger,
  headerName: 'x-request-id',
});

