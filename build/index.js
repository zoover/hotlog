'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestLogger = undefined;
exports.elasticsearchLogger = elasticsearchLogger;

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _bunyanRequest = require('bunyan-request');

var _bunyanRequest2 = _interopRequireDefault(_bunyanRequest);

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

var logger = _bunyan2.default.createLogger({
  name: runningScript,
  streams: streams
});

exports.default = logger;
var requestLogger = exports.requestLogger = (0, _bunyanRequest2.default)({
  logger: logger,
  headerName: 'x-request-id'
});

function elasticsearchLogger(config) {
  logger.info(config, 'Create elasticsearch logger');
  this.error = logger.error.bind(logger);
  this.warning = logger.warn.bind(logger);
  this.info = logger.info.bind(logger);
  this.debug = logger.debug.bind(logger);
  this.trace = function trace(method, requestUrl, body, responseBody, responseStatus) {
    logger.trace({
      method: method,
      requestUrl: requestUrl,
      body: body,
      responseBody: responseBody,
      responseStatus: responseStatus
    });
  };
  // bunyan has no close
  this.close = function close() {};
}