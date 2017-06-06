import stream from 'stream';
import PrettyStream from 'bunyan-prettystream';

const appName = process.env.APP_NAME || 'unknown_app';
const envName = process.env.ENV_NAME || 'unknown_env';
const version = process.env.VERSION || 'unknown_version';
const forcePretty = process.env.IS_PRETTY === 'true';
const nodeEnv = process.env.NODE_ENV;

export default new stream.Writable({
  write(chunk, incoding, next) {
    const recordString = chunk.toString();
    const record = JSON.parse(recordString);

    // We add serviceContext for use in Stackdriver
    // See: https://github.com/GoogleCloudPlatform/fluent-plugin-google-cloud/issues/99
    record.serviceContext = {
      service: `${envName}/${appName}`,
      version,
    };

    let stderr;
    let stdout;

    if (forcePretty || nodeEnv !== 'production') {
      stderr = new PrettyStream();
      stderr.pipe(process.stderr);

      stdout = new PrettyStream();
      stdout.pipe(process.stdout);
    } else {
      stderr = process.stderr;
      stdout = process.stdout;
    }

    if (record.level && record.level > 30) {
      stderr.write(`${JSON.stringify(record)}\n`);
    } else {
      stdout.write(`${JSON.stringify(record)}\n`);
    }
    next();
  },
});
