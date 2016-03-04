var bunyan = require('bunyan');
var fs = require('fs');
var logger;
var runningScript = require.main.filename.split('/').pop();
var rootDirPath = require.main.filename.split('/').slice(0, -1).join('/');
var logDirPath = rootDirPath + "/log";
var logFilePath = logDirPath + "/" + runningScript + ".log";
var streams = [];

try {
  var logDirStats = fs.statSync(logDirPath);
  if (logDirStats.isDirectory()) {
    // create file if not exists
    var fd = fs.openSync(logFilePath, 'a');
    fs.closeSync(fd);

    streams.push({
      level: 'info',
      path: logFilePath
    });
  }
} catch (e) {
  console.log(e);
}

streams.push({
  level: 'info',
  stream: process.stdout
});

logger = bunyan.createLogger({
  name: runningScript,
  streams: streams
});

module.exports = logger;
