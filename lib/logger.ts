import path from "path";
import appRoot from "app-root-path";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const { combine, timestamp, label, printf } = winston.format;

const appEnv = (process.env.APP_ENV || "local").toLowerCase();
const isDevFile = appEnv === "development";

interface LogPrintfInfo {
  level: string;
  message: unknown;
  label?: string;
  timestamp?: string;
  meta?: { route?: string };
}

const logFormat = printf((info: LogPrintfInfo) => {
  const route = info.meta?.route ?? "N/A";
  return `${info.timestamp} [${info.label}] ${route} | ${info.level.toUpperCase()} : ${info.message}`;
});

const logDir = path.join(appRoot.path, "logs");

const transports: winston.transport[] = isDevFile
  ? [
      new winstonDaily({
        level: "info",
        datePattern: "YYYY-MM-DD",
        dirname: logDir,
        filename: "%DATE%.log",
        maxFiles: 30,
      }),
      new winstonDaily({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: path.join(logDir, "error"),
        filename: "%DATE%.error.log",
        maxFiles: 30,
      }),
    ]
  : [new winston.transports.Console({ level: "debug" })];

const exceptionHandlers: winston.transport[] = isDevFile
  ? [
      new winstonDaily({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: logDir,
        filename: "%DATE%.exception.log",
        maxFiles: 30,
      }),
    ]
  : [new winston.transports.Console()];

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    label({ label: "BEVERAGE_MACHINE" }),
    logFormat,
  ),
  transports,
  exceptionHandlers,
});

type WinstonLevel = "error" | "warn" | "info" | "debug";

export function apiLog(
  level: WinstonLevel,
  message: string,
  route: string,
): void {
  logger.log({ level, message, meta: { route } });
}

export const log = {
  debug: (message: string) => {
    logger.debug(message);
  },
  info: (message: string) => {
    logger.info(message);
  },
  warn: (message: string) => {
    logger.warn(message);
  },
  error: (message: string) => {
    logger.error(message);
  },
};

export default logger;
