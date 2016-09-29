import bunyan from 'bunyan';
import fs from 'fs';
import stdIOStream from './stdIOStream';

function FrontEndLogger() {
  this.isFrontEnd = true;
  this.info = console.log.bind(console);
  this.error = console.error.bind(console);
  this.warning = console.warn.bind(console);
  this.trace = console.trace.bind(console);
}
export default (function () {
  if (typeof window !== 'undefined') {
    return new FrontEndLogger();
  }
  const runningScript = require.main.filename.split('/').pop();
  const logDirPath = `${process.cwd()}/log`;
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

  return bunyan.createLogger({
    name: runningScript,
    streams,
  });
})();
