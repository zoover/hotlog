'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _stdIOStream = require('./stdIOStream');

var _stdIOStream2 = _interopRequireDefault(_stdIOStream);

var _frontend = require('./frontend');

var _frontend2 = _interopRequireDefault(_frontend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logLevel = process.env.LOG_LEVEL || 'info'; /* global Rollbar */

exports.default = function logger() {
  if (typeof window !== 'undefined') {
    return new _frontend2.default();
  }
  var runningScript = require.main.filename.split('/').pop();
  var streams = [];

  streams.push({
    level: logLevel,
    stream: _stdIOStream2.default
  });

  return _bunyan2.default.createLogger({
    name: runningScript,
    streams: streams
  });
}();