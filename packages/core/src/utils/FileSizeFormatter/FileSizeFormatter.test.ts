import { describe, expect, it } from 'vitest';

import { FileSizeFormatter } from './FileSizeFormatter';

describe('FileSizeFormatter', () => {
  it('formats values using SI units by default', () => {
    const formatter = new FileSizeFormatter('en-US');

    expect(formatter.format(999)).toBe('999\u00a0B');
    expect(formatter.format(1000)).toBe('1\u00a0KB');
    expect(formatter.format(1_000_000)).toBe('1\u00a0MB');
  });

  it('formats values using IEC units', () => {
    const formatter = new FileSizeFormatter('en-US', {
      defaultUnitSystem: 'IEC',
    });

    expect(formatter.format(1023)).toBe('1,023\u00a0B');
    expect(formatter.format(1024)).toBe('1\u00a0KiB');
    expect(formatter.format(1024 ** 2)).toBe('1\u00a0MiB');
  });

  it('caps formatting at the largest unit', () => {
    const formatter = new FileSizeFormatter('en-US');

    expect(formatter.format(1000 ** 6)).toBe('1,000,000\u00a0TB');
  });

  it('uses the configured precision and allows overriding it', () => {
    const formatter = new FileSizeFormatter('en-US', {
      defaultPrecision: 1,
    });

    expect(formatter.format(1550)).toBe('1.6\u00a0KB');
    expect(formatter.format(1550, { precision: 2 })).toBe('1.55\u00a0KB');
  });

  it('allows overriding the measurement system per call', () => {
    const formatter = new FileSizeFormatter('en-US');

    expect(formatter.format(1024, { unitSystem: 'IEC' })).toBe('1\u00a0KiB');
  });

  it('localizes numbers and unit abbreviations', () => {
    const formatter = new FileSizeFormatter('ru-RU');

    expect(formatter.format(1500)).toBe('1,5\u00a0КБ');

    expect(formatter.format(1536, { unitSystem: 'IEC' })).toBe('1,5\u00a0КиБ');
  });

  it('allows overriding a localized unit system', () => {
    const formatter = new FileSizeFormatter('en-US', {
      unitSystems: {
        SI: { abbreviations: ['byte', 'kB', 'MB', 'GB', 'TB'] },
      },
    });

    expect(formatter.format(1000)).toBe('1\u00a0kB');
  });

  it('formats zero and negative finite values', () => {
    const formatter = new FileSizeFormatter('en-US');

    expect(formatter.format(0)).toBe('0\u00a0B');
    expect(formatter.format(-100)).toBe('-100\u00a0B');
  });

  it('scales negative values by magnitude', () => {
    const formatter = new FileSizeFormatter('en-US');

    expect(formatter.format(-1_500_000)).toBe('-1.5\u00a0MB');
    expect(formatter.format(-1024, { unitSystem: 'IEC' })).toBe('-1\u00a0KiB');
  });

  it('moves up a unit when rounding reaches the next threshold', () => {
    const formatter = new FileSizeFormatter('en-US');

    expect(formatter.format(999_999)).toBe('1\u00a0MB');
    expect(formatter.format(999_999_999)).toBe('1\u00a0GB');
    // Below the rounding threshold the smaller unit is kept.
    expect(formatter.format(999_990)).toBe('999.99\u00a0KB');
  });

  it('clamps out-of-range precision instead of throwing', () => {
    const formatter = new FileSizeFormatter('en-US');

    expect(formatter.format(1550, { precision: -1 })).toBe('2\u00a0KB');
    expect(() => formatter.format(1550, { precision: 101 })).not.toThrow();
  });

  it('does not treat "rue" as Russian', () => {
    const formatter = new FileSizeFormatter('rue');

    expect(formatter.format(1000)).toContain('KB');
  });

  it('throws for non-finite values', () => {
    const formatter = new FileSizeFormatter('en-US');
    const expectedError = 'Argument "value" must be a finite number!';

    expect(() => formatter.format(Number.NaN)).toThrow(expectedError);

    expect(() => formatter.format(Number.POSITIVE_INFINITY)).toThrow(
      expectedError
    );

    expect(() => formatter.format(null as unknown as number)).toThrow(
      expectedError
    );
  });
});
