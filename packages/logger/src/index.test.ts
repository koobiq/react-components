import { describe, beforeEach, afterAll, it, expect, vi } from 'vitest';

import { logger, once, setConfig } from './index.js';

describe('logger', () => {
  const initialConsole = { ...globalThis.console };
  setConfig({ scope: undefined });

  beforeEach(() => {
    globalThis.console.trace = vi.fn();
    globalThis.console.debug = vi.fn();
    globalThis.console.log = vi.fn();
    globalThis.console.info = vi.fn();
    globalThis.console.warn = vi.fn();
    globalThis.console.error = vi.fn();
  });

  afterAll(() => {
    globalThis.console = initialConsole;
  });

  describe('logger', () => {
    it('should output a console message with the debug type', () => {
      const message = 'debug message';
      logger.debug(message);
      expect(globalThis.console.debug).toHaveBeenCalledWith(message);
    });

    it('should output a console message with the log type', () => {
      const message = 'log message';
      logger.log(message);
      expect(globalThis.console.log).toHaveBeenCalledWith(message);
    });

    it('should output a console message with the info type', () => {
      const message = 'information message';
      logger.info(message);
      expect(globalThis.console.info).toHaveBeenCalledWith(message);
    });

    it('should output a console message with the warn type', () => {
      const message = 'warning message';
      logger.warn(message);
      expect(globalThis.console.warn).toHaveBeenCalledWith(message);
    });

    it('should output a console message with the error type', () => {
      const message = 'error message';
      logger.error(message);
      expect(globalThis.console.error).toHaveBeenCalledWith(message);
    });
  });

  describe('once', () => {
    beforeEach(() => {
      once.clear();
    });

    it('should output non-repeating messages only once', () => {
      once.error('first');
      once.error('first');

      expect(globalThis.console.error).toBeCalledTimes(1);

      once.error('second');

      expect(globalThis.console.error).toBeCalledTimes(2);
    });

    it('should clear the message array when calling method clear', () => {
      once.error('first');
      once.error('first');

      expect(globalThis.console.error).toBeCalledTimes(1);

      once.clear();

      once.error('first');
      expect(globalThis.console.error).toBeCalledTimes(2);
    });
  });
});
