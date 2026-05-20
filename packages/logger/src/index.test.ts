import { describe, beforeEach, afterAll, it, expect, vi } from 'vitest';

import { logger, once, setConfig } from './index.js';

describe('logger', () => {
  const initialConsole = { ...global.console };
  setConfig({ scope: undefined });

  beforeEach(() => {
    global.console.trace = vi.fn();
    global.console.debug = vi.fn();
    global.console.log = vi.fn();
    global.console.info = vi.fn();
    global.console.warn = vi.fn();
    global.console.error = vi.fn();
  });

  afterAll(() => {
    global.console = initialConsole;
  });

  describe('logger', () => {
    it('should output a console message with the debug type', () => {
      const message = 'debug message';
      logger.debug(message);
      expect(global.console.debug).toHaveBeenCalledWith(message);
    });

    it('should output a console message with the log type', () => {
      const message = 'log message';
      logger.log(message);
      expect(global.console.log).toHaveBeenCalledWith(message);
    });

    it('should output a console message with the info type', () => {
      const message = 'information message';
      logger.info(message);
      expect(global.console.info).toHaveBeenCalledWith(message);
    });

    it('should output a console message with the warn type', () => {
      const message = 'warning message';
      logger.warn(message);
      expect(global.console.warn).toHaveBeenCalledWith(message);
    });

    it('should output a console message with the error type', () => {
      const message = 'error message';
      logger.error(message);
      expect(global.console.error).toHaveBeenCalledWith(message);
    });
  });

  describe('once', () => {
    beforeEach(() => {
      once.clear();
    });

    it('should output non-repeating messages only once', () => {
      once.error('first');
      once.error('first');

      expect(global.console.error).toBeCalledTimes(1);

      once.error('second');

      expect(global.console.error).toBeCalledTimes(2);
    });

    it('should clear the message array when calling method clear', () => {
      once.error('first');
      once.error('first');

      expect(global.console.error).toBeCalledTimes(1);

      once.clear();

      once.error('first');
      expect(global.console.error).toBeCalledTimes(2);
    });
  });
});
