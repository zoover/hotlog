import stream from 'stream';

const appName = process.env.APP_NAME || 'unknown_app';
const envName = process.env.ENV_NAME || 'unknown_env';
const version = process.env.VERSION || 'unknown_version';

export default new stream.Writable({
  write(chunk, incoding, next) {
    const recordString = chunk.toString();
    const record = JSON.parse(recordString);

    // We add serviceContext for use in Stackdrive
    // See: https://github.com/GoogleCloudPlatform/fluent-plugin-google-cloud/issues/99
    record.serviceContext = {
      service: `${envName}/${appName}`,
      version,
    };

    if (record.level && record.level > 30) {
      process.stderr.write(JSON.stringify(record, null, 1)); // spacing level = 1
    } else {
      process.stdout.write(JSON.stringify(record, null, 1));
    }
    next();
  },
});
