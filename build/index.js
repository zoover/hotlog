'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runningScript = require.main.filename.split('/').pop();
var rootDirPath = require.main.filename.split('/').slice(0, -1).join('/');
var logDirPath = rootDirPath + '/log';
var logFilePath = logDirPath + '/' + runningScript + '.log';
var streams = [];

try {
  var logDirStats = _fs2.default.statSync(logDirPath);
  if (logDirStats.isDirectory()) {
    // create file if not exists
    var fd = _fs2.default.openSync(logFilePath, 'a');
    _fs2.default.closeSync(fd);

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

exports.default = _bunyan2.default.createLogger({
  name: runningScript,
  streams: streams
});