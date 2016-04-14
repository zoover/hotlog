'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _stream2.default.Writable({
  write: function write(chunk, incoding, next) {
    var recordString = chunk.toString();
    var record = JSON.parse(recordString);
    if (record.level && record.level > 30) {
      process.stderr.write(recordString);
    } else {
      process.stdout.write(recordString);
    }
    next();
  }
});