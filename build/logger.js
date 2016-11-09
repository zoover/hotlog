'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _stdIOStream = require('./stdIOStream');

var _stdIOStream2 = _interopRequireDefault(_stdIOStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FrontEndLogger() {
  this.isFrontEnd = true;
  this.info = console.log.bind(console);
  this.error = console.error.bind(console);
  this.warning = console.warn.bind(console);
  this.trace = console.trace.bind(console);
}

exports.default = function () {
  if (typeof window !== 'undefined') {
    return new FrontEndLogger();
  }
  var runningScript = require.main.filename.split('/').pop();
  var streams = [];

  streams.push({
    level: 'info',
    stream: _stdIOStream2.default
  });

  return _bunyan2.default.createLogger({
    name: runningScript,
    streams: streams
  });
}();