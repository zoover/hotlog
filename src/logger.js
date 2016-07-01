import bunyan from 'bunyan';
import fs from 'fs';
import stdIOStream from './stdIOStream';
const runningScript = require.main.filename.split('/').pop();
const logDirPath = `${process.cwd()}/log`;
const logFilePath = `${logDirPath}/${runningScript}.log`;
const streams = [];

function FrontEndLogger() {
  this.isFrontEnd = true;
  this.info = console.info;
  this.error = console.error;
  this.warning = console.warn;
  this.trace = console.trace;
}
export default (function() {
  if (typeof window !== 'undefined') {
    return new FrontEndLogger();
  }
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

  return bunyan.createLogger({
    name: runningScript,
    streams,
  });
})();
