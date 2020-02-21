const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, prettyPrint, json, colorize, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});
const logger = winston.createLogger({
  format: combine(
    timestamp(),
    json(),
    prettyPrint()
  ),
  transports: [
    new transports.Console()
  ]
});

module.exports = logger;
