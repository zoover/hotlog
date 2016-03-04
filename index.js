var bunyan = require('bunyan');
var fs = require('fs');

var logger;
var runningScript = require.main.filename.split('/').pop();
var rootDirPath = require.main.filename.split('/').slice(0, -1).join('/');
var logDirPath = rootDirPath + "/log";
var localLogFilePath = __dirname + "/" + runningScript + '.log';
var logFilePath = process.env.APP_LOG_FILE_PATH || localLogFilePath;


var streams = [];
var logDirStats = fs.statSync(logDirPath);
if (logDirStats.isDirectory()) {
  streams.push({

  });
}
streams.push();


// create file if not exists
var fd = fs.openSync(logFilePath, 'a');
fs.closeSync(fd);

logger = bunyan.createLogger({
  name: runningScript,
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'info',
      path: logFilePath
    }
  ]
});

logger.info('A normal operation going on');
logger.warn('this is a warning');
logger.debug('looking for source of a bug');
logger.error('something horrible just happened');

module.exports = logger;
