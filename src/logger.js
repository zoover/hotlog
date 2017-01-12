import bunyan from 'bunyan';
import BunyanStackDriver from './bunyan-stackdriver';
import stdIOStream from './stdIOStream';

const logLevel = process.env.LOG_LEVEL || 'info';
const appName = process.env.APP_NAME || 'unknown_app';
const envName = process.env.ENV_NAME || 'unknown_env';
const teamName = process.env.TEAM || 'unknown_team';
const version = process.env.TEAM || 'unknwon_version';

function FrontEndLogger() {
  this.isFrontEnd = true;
  this.info = console.log.bind(console);
  this.error = console.error.bind(console);
  this.warning = console.warn.bind(console);
  this.trace = console.trace.bind(console);
}

// Create the stackdriver stream
const stackdriverStream = new BunyanStackDriver({
  logName: `${teamName}/env/${envName}/logs/${appName}`,
  serviceContext: {
    service: `${envName}-${appName}`,
    version,
  },
});

export default (() => {
  if (typeof window !== 'undefined') {
    return new FrontEndLogger();
  }
  const runningScript = require.main.filename.split('/').pop();
  const streams = [];

  if (process.env.NODE_ENV === 'production') {
    streams.push({
      type: 'raw',
      level: logLevel,
      stream: stackdriverStream,
    });
  } else {
    streams.push({
      level: logLevel,
      stream: stdIOStream,
    });
  }

  return bunyan.createLogger({
    name: runningScript,
    streams,
  });
})();
