import {
  formatWithGroupSeparator,
  getRoundedParts,
  getRoundingUnit,
  parseDigitsInfo,
  toNumber,
  withDefaults,
} from './utils';
import type {
  DecimalFormatterDigitsInfo,
  DecimalFormatterValue,
} from './utils';

export type { DecimalFormatterDigitsInfo, DecimalFormatterValue };

/** Labels and separators that `formatRounded` builds an abbreviated number from. */
export type DecimalFormatterRoundingConfig = {
  /** Separator between the number and the unit label. */
  separator: string;
  /** Separator between the integer and the fraction of the rounded number. */
  groupSeparator: string;
  /** Label for the thousand unit. */
  thousand: string;
  /** Label for the million unit. */
  million: string;
  /** Label for the billion unit. */
  billion: string;
  /** Label for the trillion unit. */
  trillion: string;
};

/** Default settings and localization overrides for `DecimalFormatter`. */
export type DecimalFormatterConfig = {
  /**
   * Default digit options. A `digitsInfo` passed to a call overrides them.
   * @default { useGrouping: true, minimumIntegerDigits: 1, minimumFractionDigits: 0, maximumFractionDigits: 3 }
   */
  options?: Partial<DecimalFormatterDigitsInfo>;
  /** Overrides the localized rules of `format` and `formatTable`. */
  decimal?: {
    /** Replaces the group separator of the locale. Russian uses a thin space (`\u2009`). */
    viewGroupSeparator?: string;
  };
  /** Overrides the localized labels and separators of `formatRounded`. */
  rounding?: Partial<DecimalFormatterRoundingConfig>;
};

type LocalizedData = {
  viewGroupSeparator?: string;
  rounding: DecimalFormatterRoundingConfig;
};

const DEFAULT_LANGUAGE = 'en';

const localizedData: Record<string, LocalizedData> = {
  en: {
    rounding: {
      separator: '',
      groupSeparator: '.',
      thousand: 'K',
      million: 'M',
      billion: 'B',
      trillion: 'T',
    },
  },
  ru: {
    viewGroupSeparator: '\u2009',
    rounding: {
      separator: ' ',
      groupSeparator: ',',
      thousand: 'К',
      million: 'М',
      // Latin `B` (U+0042) according to UX Guidelines.
      billion: 'B',
      trillion: 'Т',
    },
  },
};

const DEFAULT_OPTIONS: DecimalFormatterDigitsInfo = {
  useGrouping: true,
  minimumIntegerDigits: 1,
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
};

// In running text these locales leave numbers below ten thousand ungrouped.
const UNGROUPED_SHORT_NUMBER_LOCALES = ['ru', 'ru-RU'];
const UNGROUPED_SHORT_NUMBER_LIMIT = 10_000;

/**
 * Formats numbers using Koobiq conventions: digit grouping for running text
 * and tables, and abbreviation to thousands, millions, billions and trillions.
 */
export class DecimalFormatter {
  private readonly locale: string;
  private readonly options: DecimalFormatterDigitsInfo;
  private readonly viewGroupSeparator: string | undefined;
  private readonly rounding: DecimalFormatterRoundingConfig;
  private readonly numberFormatters = new Map<string, Intl.NumberFormat>();

  constructor(locale?: string, config: DecimalFormatterConfig = {}) {
    this.locale = locale
      ? new Intl.Locale(locale).toString()
      : new Intl.NumberFormat().resolvedOptions().locale;

    const localized =
      localizedData[new Intl.Locale(this.locale).language] ??
      localizedData[DEFAULT_LANGUAGE];

    this.options = withDefaults(DEFAULT_OPTIONS, config.options);

    this.viewGroupSeparator =
      config.decimal?.viewGroupSeparator ?? localized.viewGroupSeparator;

    this.rounding = withDefaults(localized.rounding, config.rounding);
  }

  /**
   * Formats a number for running text. Russian leaves numbers below 10 000
   * ungrouped unless `digitsInfo` sets the grouping explicitly.
   * @param value The number to format. Strings are coerced to numbers.
   * @param digitsInfo Digit options in the format
   * `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}-{useGrouping}`,
   * for example `'1.0-2'` or `'4.0-2-false'`.
   * @returns The formatted number, or `null` for `null`, `undefined`, `''` and `NaN`.
   */
  format(value: DecimalFormatterValue, digitsInfo?: string): string | null {
    return this.formatDecimal(value, digitsInfo, true);
  }

  /**
   * Formats a number for a table cell: digits are always grouped, so values
   * line up by digit.
   * @param value The number to format. Strings are coerced to numbers.
   * @param digitsInfo Digit options, as in `format`.
   * @returns The formatted number, or `null` for `null`, `undefined`, `''` and `NaN`.
   */
  formatTable(
    value: DecimalFormatterValue,
    digitsInfo?: string
  ): string | null {
    return this.formatDecimal(value, digitsInfo, false);
  }

  /**
   * Abbreviates a number to thousands, millions, billions or trillions,
   * for example `15300` → `15K`. Numbers below a thousand are not abbreviated.
   * @param value The number to format. Strings are coerced to numbers.
   * @returns The abbreviated number, or `null` for `null`, `undefined`, `''` and `NaN`.
   */
  formatRounded(value: DecimalFormatterValue): string | null {
    const num = toNumber(value);

    if (num === null) return null;

    const formatter = this.getNumberFormatter({ useGrouping: false });
    const unit = getRoundingUnit(num);

    if (!unit) return formatter.format(num);

    const parts = getRoundedParts(num, unit, this.locale);

    const rounded =
      parts.fraction === undefined
        ? formatter.format(parts.num)
        : `${formatter.format(parts.num)}${this.rounding.groupSeparator}${formatter.format(parts.fraction)}`;

    return `${rounded}${this.rounding.separator}${this.rounding[unit]}`;
  }

  private formatDecimal(
    value: DecimalFormatterValue,
    digitsInfo: string | undefined,
    isRunningText: boolean
  ): string | null {
    const num = toNumber(value);

    if (num === null) return null;

    const parsed = digitsInfo ? parseDigitsInfo(digitsInfo) : {};
    const options = { ...this.options, ...parsed };

    // A minimum without a maximum raises the default maximum instead of
    // making `Intl.NumberFormat` throw.
    if (
      parsed.maximumFractionDigits === undefined &&
      options.minimumFractionDigits > options.maximumFractionDigits
    ) {
      options.maximumFractionDigits = options.minimumFractionDigits;
    }

    if (
      isRunningText &&
      parsed.useGrouping === undefined &&
      UNGROUPED_SHORT_NUMBER_LOCALES.includes(this.locale) &&
      Math.abs(num) < UNGROUPED_SHORT_NUMBER_LIMIT
    ) {
      options.useGrouping = false;
    }

    return formatWithGroupSeparator(
      num,
      this.getNumberFormatter(options),
      this.viewGroupSeparator
    );
  }

  private getNumberFormatter(
    options: Intl.NumberFormatOptions
  ): Intl.NumberFormat {
    const key = JSON.stringify(options);
    let formatter = this.numberFormatters.get(key);

    if (!formatter) {
      formatter = new Intl.NumberFormat(this.locale, options);
      this.numberFormatters.set(key, formatter);
    }

    return formatter;
  }
}
