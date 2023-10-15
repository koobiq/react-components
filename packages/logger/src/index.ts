export type LoggerType = 'log' | 'error' | 'warn' | 'info' | 'trace' | 'debug';
export type Logger = {
  [keyof in LoggerType]: (message: any, ...rest: any[]) => void;
};

let defaultConfig = {
  scope: 'koobiq',
};

const setConfig = (config: Partial<typeof defaultConfig>) => {
  defaultConfig = { ...defaultConfig, ...config };
};

const getMessage = (message: any) => {
  if (!defaultConfig.scope) {
    return message;
  }

  return `[${defaultConfig.scope}] ${message}`;
};

const logger: Logger = {
  info: (message: any, ...rest) => {
    console.info(getMessage(message), ...rest);
  },
  warn: (message, ...rest) => {
    console.warn(getMessage(message), ...rest);
  },
  error: (message, ...rest) => {
    console.error(getMessage(message), ...rest);
  },
  log: (message, ...rest) => {
    console.log(getMessage(message), ...rest);
  },
  trace: (message, ...rest) => {
    console.trace(getMessage(message), ...rest);
  },
  debug: (message, ...rest) => {
    console.debug(getMessage(message), ...rest);
  },
};

const logged = new Set();

const once =
  (type: LoggerType) =>
  (message: any, ...rest: any[]) => {
    if (!logged.has(message)) {
      logger[type](message, ...rest);
      logged.add(message);
    }
  };

once.clear = () => logged.clear();
once.trace = once('trace');
once.debug = once('debug');
once.info = once('info');
once.warn = once('warn');
once.error = once('error');
once.log = once('log');

const deprecate = once('warn');

export { logger, deprecate, once, setConfig };
