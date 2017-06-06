'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchLogger = exports.requestLogger = undefined;

var _bunyanRequest = require('bunyan-request');

var _bunyanRequest2 = _interopRequireDefault(_bunyanRequest);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _logger2.default;
var requestLogger = exports.requestLogger = function requestLogger(logger) {
  if (logger.isFrontEnd) return undefined;
  return (0, _bunyanRequest2.default)({
    logger: logger,
    headerName: 'x-request-id'
  });
}(_logger2.default);

var ElasticsearchLogger = exports.ElasticsearchLogger = function ElasticsearchLogger(logger) {
  if (logger.isFrontEnd) return undefined;
  return function ESLogger(config) {
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
  };
}(_logger2.default);