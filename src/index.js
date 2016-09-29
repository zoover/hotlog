import bunyanRequest from 'bunyan-request';
import loggerInstance from './logger';

export default loggerInstance;

export const requestLogger = (function (logger) {
  if (logger.isFrontEnd) return;
  return bunyanRequest({
    logger,
    headerName: 'x-request-id',
  });
})(loggerInstance);


export const ElasticsearchLogger = (function (logger) {
  if (logger.isFrontEnd) return;
  return function ElasticsearchLogger(config) {
    logger.info(config, 'Create elasticsearch logger');
    this.error = logger.error.bind(logger);
    this.warning = logger.warn.bind(logger);
    this.info = logger.info.bind(logger);
    this.debug = logger.debug.bind(logger);
    this.trace = function trace(method, requestUrl, body, responseBody, responseStatus) {
      logger.trace({
        method,
        requestUrl,
        body,
        responseBody,
        responseStatus,
      });
    };
    // bunyan has no close
    this.close = function close() {};
  };
})(loggerInstance);
