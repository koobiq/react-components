import { resolveLocale } from '../resolveLocale';

import {
  formatWithGroupSeparator,
  getRoundedParts,
  getRoundingUnit,
  isBelowLimitWhenRounded,
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
  /**
   * Separator between the integer and the fraction of the rounded number.
   * Defaults to the decimal separator of the locale.
   */
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
   * @default { minimumIntegerDigits: 1, minimumFractionDigits: 0, maximumFractionDigits: 3 }
   */
  options?: Partial<DecimalFormatterDigitsInfo>;
  /** Overrides the localized rules of `format` and `formatTable`. */
  decimal?: {
    /**
     * Replaces the group separator of the locale; an empty string keeps it.
     * Russian uses a thin space (`\u2009`).
     */
    viewGroupSeparator?: string;
  };
  /** Overrides the localized labels and separators of `formatRounded`. */
  rounding?: Partial<DecimalFormatterRoundingConfig>;
};

type LocalizedData = {
  viewGroupSeparator?: string;
  /** In running text, numbers below this limit stay ungrouped. */
  shortNumberLimit?: number;
  // The fraction separator of rounded numbers comes from the locale.
  rounding: Omit<DecimalFormatterRoundingConfig, 'groupSeparator'>;
};

const DEFAULT_LANGUAGE = 'en';

const localizedData: Record<string, LocalizedData> = {
  en: {
    rounding: {
      separator: '',
      thousand: 'K',
      million: 'M',
      billion: 'B',
      trillion: 'T',
    },
  },
  ru: {
    viewGroupSeparator: '\u2009',
    shortNumberLimit: 10_000,
    rounding: {
      separator: ' ',
      thousand: 'К',
      million: 'М',
      // Latin `B` (U+0042) according to UX Guidelines.
      billion: 'B',
      trillion: 'Т',
    },
  },
};

const DEFAULT_OPTIONS: DecimalFormatterDigitsInfo = {
  minimumIntegerDigits: 1,
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
};

/**
 * Formats numbers using Koobiq conventions: digit grouping for running text
 * and tables, and abbreviation to thousands, millions, billions and trillions.
 */
export class DecimalFormatter {
  private readonly locale: string;
  private readonly localeId: string;
  private readonly options: DecimalFormatterDigitsInfo;
  private readonly viewGroupSeparator: string | undefined;
  private readonly shortNumberLimit: number | undefined;
  private readonly rounding: DecimalFormatterRoundingConfig;
  private readonly numberFormatters = new Map<string, Intl.NumberFormat>();

  constructor(locale?: string, config: DecimalFormatterConfig = {}) {
    const resolved = resolveLocale(locale);

    this.locale = resolved.locale;
    this.localeId = resolved.id;

    const localized =
      localizedData[resolved.language] ?? localizedData[DEFAULT_LANGUAGE];

    this.options = withDefaults(DEFAULT_OPTIONS, config.options);

    this.viewGroupSeparator =
      config.decimal?.viewGroupSeparator ?? localized.viewGroupSeparator;

    this.shortNumberLimit = localized.shortNumberLimit;

    const decimalSeparator =
      this.getNumberFormatter({ useGrouping: false })
        .formatToParts(1.1)
        .find((part) => part.type === 'decimal')?.value ?? '.';

    this.rounding = withDefaults(
      { ...localized.rounding, groupSeparator: decimalSeparator },
      config.rounding
    );
  }

  /**
   * Formats a number for running text. Digits are grouped by the rule of the
   * locale: Russian, for one, leaves numbers below 10 000 ungrouped. A grouping
   * set in `digitsInfo` or `config.options` overrides the rule.
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
   * Formats a number for a table cell: unless the grouping is turned off,
   * digits are grouped in every number, so values line up by digit.
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

    if (!unit || !Number.isFinite(num)) return formatter.format(num);

    const parts = getRoundedParts(num, unit, this.localeId);

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

    // A table groups every number so that the values line up by digit; running
    // text leaves the grouping to the locale.
    if (!isRunningText && options.useGrouping === undefined) {
      options.useGrouping = true;
    }

    if (
      isRunningText &&
      options.useGrouping === undefined &&
      this.shortNumberLimit !== undefined &&
      isBelowLimitWhenRounded(
        num,
        options.maximumFractionDigits,
        this.shortNumberLimit
      )
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
