function FrontEndLogger() {
  this.isFrontEnd = true;
  this.info = console.log.bind(console); // eslint-disable-line no-console
  this.error = function proxyError(...args) {
    if (typeof Rollbar !== 'undefined' && typeof Rollbar.error === 'function') {
      Rollbar.error(...args);
    }

    console.error(...args); // eslint-disable-line no-console
  };
  this.warn = function proxyWarn(...args) {
    if (typeof Rollbar !== 'undefined' && typeof Rollbar.warning === 'function') {
      Rollbar.warning(...args);
    }

    console.warn(...args); // eslint-disable-line no-console
  };
  this.trace = console.trace.bind(console); // eslint-disable-line no-console
}

export default FrontEndLogger;
