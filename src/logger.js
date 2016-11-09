import bunyan from 'bunyan';
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
  const streams = [];

  streams.push({
    level: 'info',
    stream: stdIOStream,
  });

  return bunyan.createLogger({
    name: runningScript,
    streams,
  });
})();
