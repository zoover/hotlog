'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _bunyanPrettystream = require('bunyan-prettystream');

var _bunyanPrettystream2 = _interopRequireDefault(_bunyanPrettystream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appName = process.env.APP_NAME || 'unknown_app';
var envName = process.env.ENV_NAME || 'unknown_env';
var version = process.env.VERSION || 'unknown_version';
var forcePretty = process.env.IS_PRETTY === 'true';
var nodeEnv = process.env.NODE_ENV;

exports.default = new _stream2.default.Writable({
  write: function write(chunk, incoding, next) {
    var recordString = chunk.toString();
    var record = JSON.parse(recordString);

    // We add serviceContext for use in Stackdriver
    // See: https://github.com/GoogleCloudPlatform/fluent-plugin-google-cloud/issues/99
    record.serviceContext = {
      service: envName + '/' + appName,
      version: version
    };

    var stderr = void 0;
    var stdout = void 0;

    if (forcePretty || nodeEnv !== 'production') {
      stderr = new _bunyanPrettystream2.default();
      stderr.pipe(process.stderr);

      stdout = new _bunyanPrettystream2.default();
      stdout.pipe(process.stdout);
    } else {
      stderr = process.stderr;
      stdout = process.stdout;
    }

    if (record.level && record.level > 30) {
      stderr.write(JSON.stringify(record) + '\n');
    } else {
      stdout.write(JSON.stringify(record) + '\n');
    }
    next();
  }
});