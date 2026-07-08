import { describe, expect, it } from 'vitest';

import { formatFileSize } from './formatFileSize';

describe('formatFileSize', () => {
  it('formats bytes below 1 KB in bytes', () => {
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('scales to the largest unit that keeps the value >= 1', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(formatFileSize(1024 ** 3)).toBe('1 GB');
    expect(formatFileSize(1024 ** 4)).toBe('1 TB');
  });

  it('caps at the largest known unit', () => {
    expect(formatFileSize(1024 ** 6)).toContain('TB');
  });

  it('rounds to two fraction digits by default', () => {
    // 148909 B / 1024 = 145.4189 -> 145.42
    expect(formatFileSize(148909)).toBe('145.42 KB');
  });

  it('treats invalid or negative input as 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(-100)).toBe('0 B');
    expect(formatFileSize(Number.NaN)).toBe('0 B');
  });

  it('uses custom unit labels', () => {
    expect(
      formatFileSize(1024, {
        unitLabels: { KB: 'КБ' },
      })
    ).toBe('1 КБ');
  });

  it('uses a custom number formatter', () => {
    expect(
      formatFileSize(1536, {
        formatNumber: (value) => value.toFixed(1),
      })
    ).toBe('1.5 KB');
  });
});
