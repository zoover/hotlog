import util from 'util';
import logging from '@google-cloud/logging';
import stream from 'stream';
import destroyCircular from 'destroy-circular';

const Writable = stream.Writable;

const nameFromLevel = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal',
};
const mapLevelToSeverity = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'ALERT',
};

function BunyanStackDriver(opts, error) {
  Writable.call(this, { objectMode: true });

  const options = opts || {};

  const gopts = {};

  if (options.projectId) {
    gopts.projectId = options.projectId;
  } else if (process.env.GCLOUD_PROJECT) {
    // Noop, gcloud will pick this up.
  } else {
    throw new Error('option "projectId" or env variable GCLOUD_PROJECT required');
  }

  const logName = options.logName || 'default';

  this.error = error || function () {};

  // ms. GCP's default limit is 20 RPS.
  this.writeInterval = 'writeInterval' in options ? options.writeInterval : 500;

  // object(MonitoredResource)
  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  if (options.resource) {
    if (options.resource.type) {
      options.resource.labels = options.resource.labels || {}; // required
      this.resource = options.resource;
    } else {
      throw new Error('Property "type" required when specifying a resource');
    }
  } else {
    this.resource = {
      type: 'global',
      labels: {},
    };
  }

  // If not provided, gcloud will attempt automatic auth.
  if (options.keyFilename) {
    gopts.keyFilename = options.keyFilename;
  }
  if (options.credentials) {
    gopts.credentials = options.credentials;
  }

  const loggingClient = logging(gopts);

  this.log = loggingClient.log(logName);

  this.entryQueue = [];
}

util.inherits(BunyanStackDriver, Writable);

let once = true;

/**
 * Convert JS standard objects to strings, remove undefined. This is not
 * cycle-safe.
 * https://github.com/GoogleCloudPlatform/gcloud-node/issues/1354

function strictJSON(obj) {
  for (var k in o) {
    var v = o[k];
    if (v instanceof Date || v instanceof Error || v instanceof RegExp) {
      o[k] = v.toJSON();
    } else if (v === undefined) {
      delete o[k];
    } else if (typeof v === 'object') {
      strictJSON(v);
    }
  }
}
 */

BunyanStackDriver.prototype._write = function write( // eslint-disable-line no-underscore-dangle
    recordParam, encoding, callback) {
  let timestamp;
  let record = recordParam;
  if (typeof record === 'string') {
    if (once) {
      once = false;
      console.warn('BunyanStackDriver: use "streams: [ type: "raw", stream: new BunyanStackDriver(...) ]" for better performance.');
    }
    record = JSON.parse(record);
    timestamp = new Date(record.time);
  } else {
    timestamp = record.time;
  }

  // This might slow down the logging a bit, but will protect against circular references
  destroyCircular(record);
  // strictJSON(record);

  const metadata = {
    resource: this.resource,
    timestamp,
    severity: mapLevelToSeverity[nameFromLevel[record.level]] || 'DEFAULT',
  };

  const entry = this.log.entry(metadata, record);

  this.entryQueue.push(entry);

  if (!this.writeQueued) {
    this.writeQueued = true;
    setTimeout(
        this._writeToServer.bind(this), // eslint-disable-line no-underscore-dangle
        this.writeInterval);
  }

  callback();
};

BunyanStackDriver.prototype._writeToServer = function () { // eslint-disable-line no-underscore-dangle, max-len
  const self = this;

  this.writeQueued = false;

  // Atomically get the entries to send and clear the queue
  const entries = this.entryQueue.splice(0);

  const options = {
    partialSuccess: true,
  };

  this.log.write(entries, options, err => (
      self.error(err)
  ));
};

module.exports = BunyanStackDriver;
