'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appName = process.env.APP_NAME || 'unknown_app';
var envName = process.env.ENV_NAME || 'unknown_env';
var version = process.env.VERSION || 'unknown_version';

exports.default = new _stream2.default.Writable({
  write: function write(chunk, incoding, next) {
    var recordString = chunk.toString();
    var record = JSON.parse(recordString);

    // We add serviceContext for use in Stackdrive
    // See: https://github.com/GoogleCloudPlatform/fluent-plugin-google-cloud/issues/99
    record.serviceContext = {
      service: envName + '/' + appName,
      version: version
    };

    if (record.level && record.level > 30) {
      process.stderr.write(JSON.stringify(record) + '\n');
    } else {
      process.stdout.write(JSON.stringify(record) + '\n');
    }
    next();
  }
});