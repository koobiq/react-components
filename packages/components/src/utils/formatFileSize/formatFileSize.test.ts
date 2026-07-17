import { describe, expect, it } from 'vitest';

import { formatFileSize } from './formatFileSize';

describe('formatFileSize', () => {
  it('formats bytes below 1 KB in bytes', () => {
    expect(formatFileSize(512)).toBe('512\u00a0B');
  });

  it('scales to the largest unit that keeps the value >= 1', () => {
    expect(formatFileSize(1024)).toBe('1\u00a0KB');
    expect(formatFileSize(1024 * 1024)).toBe('1\u00a0MB');
    expect(formatFileSize(1024 ** 3)).toBe('1\u00a0GB');
    expect(formatFileSize(1024 ** 4)).toBe('1\u00a0TB');
  });

  it('caps at the largest known unit', () => {
    expect(formatFileSize(1024 ** 6)).toContain('TB');
  });

  it('rounds to two fraction digits by default', () => {
    // 148909 B / 1024 = 145.4189 -> 145.42
    const value = 148909 / 1024;

    const formatted = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
    }).format(value);

    expect(formatFileSize(148909)).toBe(`${formatted}\u00a0KB`);
  });

  it('treats invalid or negative input as 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0\u00a0B');
    expect(formatFileSize(-100)).toBe('0\u00a0B');
    expect(formatFileSize(Number.NaN)).toBe('0\u00a0B');
  });

  it('uses custom unit labels', () => {
    expect(
      formatFileSize(1024, {
        unitLabels: { KB: 'КБ' },
      })
    ).toBe('1\u00a0КБ');
  });

  it('uses a custom number formatter', () => {
    expect(
      formatFileSize(1536, {
        formatNumber: (value) => value.toFixed(1),
      })
    ).toBe('1.5\u00a0KB');
  });
});
