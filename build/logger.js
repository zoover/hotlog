'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _stdIOStream = require('./stdIOStream');

var _stdIOStream2 = _interopRequireDefault(_stdIOStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Rollbar */

var logLevel = process.env.LOG_LEVEL || 'info';

function FrontEndLogger() {
  this.isFrontEnd = true;
  this.info = console.log.bind(console); // eslint-disable-line no-console
  this.error = function proxyError() {
    var _console;

    if (typeof Rollbar !== 'undefined' && typeof Rollbar.error === 'function') {
      var _Rollbar;

      (_Rollbar = Rollbar).error.apply(_Rollbar, arguments);
    }

    (_console = console).error.apply(_console, arguments); // eslint-disable-line no-console
  };
  this.warn = function proxyWarn() {
    var _console2;

    if (typeof Rollbar !== 'undefined' && typeof Rollbar.warning === 'function') {
      var _Rollbar2;

      (_Rollbar2 = Rollbar).warning.apply(_Rollbar2, arguments);
    }

    (_console2 = console).warn.apply(_console2, arguments); // eslint-disable-line no-console
  };
  this.trace = console.trace.bind(console); // eslint-disable-line no-console
}

exports.default = function logger() {
  if (typeof window !== 'undefined') {
    return new FrontEndLogger();
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