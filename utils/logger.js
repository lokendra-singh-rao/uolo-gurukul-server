import winston from "winston";
import fs from "fs";

const date = new Date();
const filename = `${date.getDate()}-${
  date.getMonth() + 1
}-${date.getFullYear()}`;

export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `ErrorLogs/Error-${filename}.log`,
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: `ErrorLogs/Info-${filename}.log`,
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

export async function rotateLogFiles() {
  const date = new Date();

  Date.prototype.subtractDays = function (d) {
    this.setTime(this.getTime() - d * 24 * 60 * 60 * 1000);
    return this;
  };

  date.subtractDays(5);

  const errorLogFilename = `ErrorLogs/Error-${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}.log`;
  const infoLogFilename = `ErrorLogs/Info-${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}.log`;

  fs.unlink(`./${errorLogFilename}`, (err) => {
    if (err) {
      logger.error(`Error deleting error log file ${err.message}`);
    } else {
      logger.info(`Deleted error logger file ${errorLogFilename}`);
    }
  });

  fs.unlink(`./${infoLogFilename}`, (err) => {
    if (err) {
      logger.error(`"Error deleting info log file ${err.message}`);
    } else {
      logger.info(`Deleted info logger file ${infoLogFilename}`);
    }
  });
}

//response interceptor
