import { describe, expect, it } from 'vitest';

import { DecimalFormatter } from './DecimalFormatter';

const THIN_SPACE = '\u2009';

describe('DecimalFormatter', () => {
  describe('format', () => {
    it('leaves Russian numbers below ten thousand ungrouped', () => {
      const formatter = new DecimalFormatter('ru-RU');

      expect(formatter.format(1234)).toBe('1234');
      expect(formatter.format(-9999)).toBe('-9999');
      expect(formatter.format(12345.6789)).toBe(`12${THIN_SPACE}345,679`);

      expect(formatter.format(1_000_000_000)).toBe(
        `1${THIN_SPACE}000${THIN_SPACE}000${THIN_SPACE}000`
      );
    });

    it('applies the Russian rule to the language tag without a region', () => {
      const formatter = new DecimalFormatter('ru');

      expect(formatter.format(1234)).toBe('1234');
    });

    it('groups short Russian numbers when digitsInfo sets the grouping', () => {
      const formatter = new DecimalFormatter('ru-RU');

      expect(formatter.format(1234, '1.0-3-true')).toBe(`1${THIN_SPACE}234`);
      expect(formatter.format(12345, '1.0-3-false')).toBe('12345');
    });

    it('groups English numbers with the locale separator', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.format(1234)).toBe('1,234');
      expect(formatter.format(12345.6789)).toBe('12,345.679');
    });

    it('applies digitsInfo', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.format(12345.6789, '1.0-2')).toBe('12,345.68');
      expect(formatter.format(1.5, '1.2-2')).toBe('1.50');
      expect(formatter.format(5, '3.0-0')).toBe('005');
      expect(formatter.format(1234.5678, '4.0-2-false')).toBe('1234.57');
      expect(formatter.format(1.23456, '.0-1')).toBe('1.2');
      expect(formatter.format(1.23456, '2.')).toBe('01.235');
    });

    it('raises the default maximum to a larger minimum', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.format(1, '1.5')).toBe('1.00000');
    });

    it('rejects a malformed digitsInfo', () => {
      const formatter = new DecimalFormatter('en-US');

      const malformed = [
        '10-2',
        '1..0-2',
        '-1.0-2',
        ' 1.0-2',
        '1x.0-2',
        '1.0-2-',
        '1.0-2-yes',
        'abc',
      ];

      for (const digitsInfo of malformed) {
        expect(() => formatter.format(1234.5678, digitsInfo)).toThrow(
          `${digitsInfo} is not a valid digit info`
        );
      }
    });

    it('accepts every well-formed digitsInfo', () => {
      const formatter = new DecimalFormatter('en-US');

      for (const minFraction of [0, 2, 5]) {
        for (const extra of [0, 3]) {
          const maxFraction = minFraction + extra;
          const spec = `1.${minFraction}-${maxFraction}`;

          for (const digitsInfo of [spec, `${spec}-true`, `${spec}-false`]) {
            const fraction =
              formatter.format(1234.5678, digitsInfo)!.split('.')[1] ?? '';

            expect(fraction.length).toBeGreaterThanOrEqual(minFraction);
            expect(fraction.length).toBeLessThanOrEqual(maxFraction);
          }
        }
      }
    });
  });

  describe('formatTable', () => {
    it('always groups digits', () => {
      const formatter = new DecimalFormatter('ru-RU');

      expect(formatter.formatTable(1234)).toBe(`1${THIN_SPACE}234`);
      expect(formatter.formatTable(56789)).toBe(`56${THIN_SPACE}789`);
    });

    it('applies digitsInfo', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.formatTable(1234, '1.2-2')).toBe('1,234.00');
      expect(formatter.formatTable(1234, '1.0-3-false')).toBe('1234');
    });
  });

  describe('formatRounded', () => {
    it('abbreviates using the localized labels', () => {
      expect(new DecimalFormatter('ru-RU').formatRounded(10_000)).toBe('10 К');

      expect(new DecimalFormatter('en-US').formatRounded(10_000)).toBe('10K');
    });

    it('rounds within the intervals of the Koobiq guidelines', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.formatRounded(152)).toBe('152');
      expect(formatter.formatRounded(1515)).toBe('2K');
      expect(formatter.formatRounded(152_352)).toBe('152K');
      expect(formatter.formatRounded(1.034e6)).toBe('1.0M');
      expect(formatter.formatRounded(10.434e6)).toBe('10M');
      expect(formatter.formatRounded(1.5e9)).toBe('1.5B');
      expect(formatter.formatRounded(2.5e12)).toBe('2.5T');
    });

    // 2K is a number in [1500...2500), 2.0K is a number in [1950...2050).
    it('handles the 2K and 2.0K case', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.formatRounded(1051)).toBe('1K');
      expect(formatter.formatRounded(1499)).toBe('1K');
      expect(formatter.formatRounded(1515)).toBe('2K');
      expect(formatter.formatRounded(2015)).toBe('2.0K');
      expect(formatter.formatRounded(2800)).toBe('3K');
      expect(formatter.formatRounded(1750)).toBe('2K');
    });

    it('formats Russian fractions with a comma', () => {
      const formatter = new DecimalFormatter('ru-RU');

      expect(formatter.formatRounded(2015)).toBe('2,0 К');
      expect(formatter.formatRounded(1.5e9)).toBe('1,5 B');
    });

    it('does not abbreviate numbers below a thousand', () => {
      const formatter = new DecimalFormatter('ru-RU');

      expect(formatter.formatRounded(999)).toBe('999');
      expect(formatter.formatRounded(152.456)).toBe('152,456');
    });

    // Koobiq Angular `kbqRoundNumber` prints these, so the React port does too.
    it('matches Koobiq Angular output', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.formatRounded(1_960_000)).toBe('1.10M');
      expect(formatter.formatRounded(999_600)).toBe('1000K');
      expect(formatter.formatRounded(-15_000)).toBe('-15000');

      // The intervals apply to `ru-RU`, `en-US`, `es-LA` and `pt-BR` only.
      expect(new DecimalFormatter('ru').formatRounded(1515)).toBe('1,5 К');
      expect(new DecimalFormatter('ru-RU').formatRounded(1515)).toBe('2 К');
    });
  });

  describe('values', () => {
    it('returns null for empty values', () => {
      const formatter = new DecimalFormatter('en-US');

      for (const value of [null, undefined, '', Number.NaN]) {
        expect(formatter.format(value)).toBeNull();
        expect(formatter.formatTable(value)).toBeNull();
        expect(formatter.formatRounded(value)).toBeNull();
      }
    });

    it('does not parse digitsInfo for an empty value', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.format(null, 'abc')).toBeNull();
    });

    it('coerces numeric strings', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(formatter.format('1234.5')).toBe('1,234.5');
      expect(formatter.formatRounded('15300')).toBe('15K');
    });

    it('throws for non-numeric strings', () => {
      const formatter = new DecimalFormatter('en-US');

      expect(() => formatter.format('12abc')).toThrow('12abc is not a number');

      expect(() => formatter.formatRounded('abc')).toThrow(
        'abc is not a number'
      );
    });
  });

  describe('config', () => {
    it('overrides the default digit options', () => {
      const formatter = new DecimalFormatter('en-US', {
        options: { maximumFractionDigits: 1 },
      });

      expect(formatter.format(1.25)).toBe('1.3');
      expect(formatter.format(1.25, '1.0-2')).toBe('1.25');
    });

    it('overrides the group separator', () => {
      const formatter = new DecimalFormatter('en-US', {
        decimal: { viewGroupSeparator: ' ' },
      });

      expect(formatter.format(12345)).toBe('12 345');
    });

    it('overrides the rounding labels', () => {
      const formatter = new DecimalFormatter('en-US', {
        rounding: { separator: ' ', thousand: 'k' },
      });

      expect(formatter.formatRounded(15_300)).toBe('15 k');
      expect(formatter.formatRounded(1.5e9)).toBe('1.5 B');
    });

    it('keeps the localized defaults for undefined overrides', () => {
      const formatter = new DecimalFormatter('ru-RU', {
        rounding: { thousand: undefined },
      });

      expect(formatter.formatRounded(15_300)).toBe('15 К');
    });
  });

  describe('locale', () => {
    it('falls back to English data for other languages', () => {
      const formatter = new DecimalFormatter('de-DE');

      expect(formatter.format(12345)).toBe('12.345');
      expect(formatter.formatRounded(1.5e9)).toBe('1.5B');
    });

    it('does not treat "rue" as Russian', () => {
      const formatter = new DecimalFormatter('rue');

      expect(formatter.formatRounded(15_300)).toContain('K');
    });
  });
});
