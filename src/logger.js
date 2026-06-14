const pino = require('pino');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino/file', options: { destination: path.join(logDir, 'app.log'), mkdir: true } }
    : undefined,
  redact: {
    paths: ['req.headers.cookie', 'req.headers.authorization', 'password', 'token', 'otp', 'secret'],
    censor: '[REDACTED]'
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      ip: req.ip
    }),
    err: pino.stdSerializers.err
  }
});

module.exports = logger;
