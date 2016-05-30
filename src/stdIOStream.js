import stream from 'stream';

export default new stream.Writable({
  write(chunk, incoding, next) {
    const recordString = chunk.toString();
    const record = JSON.parse(recordString);
    if (record.level && record.level > 30) {
      process.stderr.write(recordString);
    } else {
      process.stdout.write(recordString);
    }
    next();
  },
});
