import { once } from '@koobiq/logger';

import { DecimalFormatter } from '../DecimalFormatter';
import { resolveLocale } from '../resolveLocale';

/** Measurement systems supported by `FileSizeFormatter`. */
export const fileSizeMeasurementSystem = ['SI', 'IEC'] as const;

/** A measurement system supported by `FileSizeFormatter`. */
export type FileSizeMeasurementSystem =
  (typeof fileSizeMeasurementSystem)[number];

/** Unit abbreviations ordered from bytes through terabytes. */
export type FileSizeUnitAbbreviations = readonly [
  string,
  string,
  string,
  string,
  string,
];

/** Scaling and unit labels for a file-size measurement system. */
export type FileSizeUnitSystem = {
  abbreviations: FileSizeUnitAbbreviations;
  base: number;
  power: number;
};

/** Default settings and unit-system overrides for `FileSizeFormatter`. */
export type FileSizeFormatterConfig = {
  /**
   * Default measurement system.
   * @default 'SI'
   */
  defaultUnitSystem?: FileSizeMeasurementSystem;
  /**
   * Default maximum number of fraction digits.
   * @default 2
   */
  defaultPrecision?: number;
  /** Overrides the built-in localized unit systems. */
  unitSystems?: Partial<
    Record<FileSizeMeasurementSystem, Partial<FileSizeUnitSystem>>
  >;
  /**
   * Overrides the digit grouping of the value, which follows `DecimalFormatter`
   * rules by default. The number of fraction digits still comes from
   * `defaultPrecision` and `precision`.
   */
  numberFormat?: {
    /**
     * Groups the digits of every value (`true`) or of none (`false`). When not
     * set, the grouping rule of the locale applies.
     */
    useGrouping?: boolean;
    /**
     * Replaces the group separator of the locale; an empty string keeps it.
     * Russian uses a thin space.
     */
    viewGroupSeparator?: string;
  };
};

/** Overrides for formatting an individual byte value. */
export type FileSizeFormatOptions = {
  /** Overrides the configured maximum number of fraction digits. */
  precision?: number;
  /** Overrides the configured measurement system. */
  unitSystem?: FileSizeMeasurementSystem;
};

const INVALID_VALUE_ERROR = 'Argument "value" must be a finite number!';
const NON_BREAKING_SPACE = '\u00a0';

const DEFAULT_PRECISION = 2;
const MIN_PRECISION = 0;
const MAX_PRECISION = 100;

export const FILE_SIZE_FORMATTER_ERROR_PRECISION_RANGE = `FileSizeFormatter: "precision" must be an integer between ${MIN_PRECISION} and ${MAX_PRECISION}.`;

// Base and power are physics, not localization — they stay constant across
// languages, so keep them separate from the per-locale abbreviations.
const unitSystemScales: Record<
  FileSizeMeasurementSystem,
  Pick<FileSizeUnitSystem, 'base' | 'power'>
> = {
  SI: { base: 10, power: 3 },
  IEC: { base: 2, power: 10 },
};

const DEFAULT_LANGUAGE = 'en';

const localizedAbbreviations: Record<
  string,
  Record<FileSizeMeasurementSystem, FileSizeUnitAbbreviations>
> = {
  en: {
    SI: ['B', 'KB', 'MB', 'GB', 'TB'],
    IEC: ['B', 'KiB', 'MiB', 'GiB', 'TiB'],
  },
  ru: {
    SI: ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'],
    IEC: ['Б', 'КиБ', 'МиБ', 'ГиБ', 'ТиБ'],
  },
};

const getLocalizedUnitSystems = (
  language: string
): Record<FileSizeMeasurementSystem, FileSizeUnitSystem> => {
  const abbreviations =
    localizedAbbreviations[language] ??
    localizedAbbreviations[DEFAULT_LANGUAGE];

  return {
    SI: { ...unitSystemScales.SI, abbreviations: abbreviations.SI },
    IEC: { ...unitSystemScales.IEC, abbreviations: abbreviations.IEC },
  };
};

const mergeUnitSystem = (
  defaults: FileSizeUnitSystem,
  overrides?: Partial<FileSizeUnitSystem>
): FileSizeUnitSystem => ({
  abbreviations: overrides?.abbreviations ?? defaults.abbreviations,
  base: overrides?.base ?? defaults.base,
  power: overrides?.power ?? defaults.power,
});

const isPrecisionInRange = (precision: number): boolean =>
  Number.isInteger(precision) &&
  precision >= MIN_PRECISION &&
  precision <= MAX_PRECISION;

const clampPrecision = (precision: number, fallback: number): number => {
  if (!Number.isFinite(precision)) return fallback;

  return Math.min(
    Math.max(Math.trunc(precision), MIN_PRECISION),
    MAX_PRECISION
  );
};

const getHumanizedSize = (
  value: number,
  system: FileSizeUnitSystem,
  precision: number
): { value: number; unit: string } => {
  const orderOfMagnitude = system.base ** system.power;
  const lastUnitIndex = system.abbreviations.length - 1;
  const magnitude = Math.abs(value);

  let unitIndex = 0;
  let result = magnitude;

  while (unitIndex < lastUnitIndex && result >= orderOfMagnitude) {
    unitIndex += 1;
    result = magnitude / orderOfMagnitude ** unitIndex;
  }

  // Rounding can land back on the threshold the loop just cleared, so 999_999 B
  // would read as "1000 KB" rather than "1 MB".
  if (
    unitIndex < lastUnitIndex &&
    Number(result.toFixed(precision)) >= orderOfMagnitude
  ) {
    unitIndex += 1;
    result = magnitude / orderOfMagnitude ** unitIndex;
  }

  return {
    value: value < 0 ? -result : result,
    unit: system.abbreviations[unitIndex],
  };
};

/** Formats byte values using Koobiq SI or IEC file-size conventions. */
export class FileSizeFormatter {
  private readonly defaultPrecision: number;
  private readonly defaultUnitSystem: FileSizeMeasurementSystem;
  private readonly unitSystems: Record<
    FileSizeMeasurementSystem,
    FileSizeUnitSystem
  >;
  private readonly decimalFormatter: DecimalFormatter;
  private readonly useGrouping: boolean | undefined;

  constructor(locale?: string, config: FileSizeFormatterConfig = {}) {
    const resolved = resolveLocale(locale);

    this.decimalFormatter = new DecimalFormatter(resolved.locale, {
      decimal: {
        viewGroupSeparator: config.numberFormat?.viewGroupSeparator,
      },
    });

    this.useGrouping = config.numberFormat?.useGrouping;

    const localizedUnitSystems = getLocalizedUnitSystems(resolved.language);

    this.defaultPrecision = this.resolvePrecision(
      config.defaultPrecision,
      DEFAULT_PRECISION
    );

    this.defaultUnitSystem = config.defaultUnitSystem ?? 'SI';

    this.unitSystems = {
      SI: mergeUnitSystem(localizedUnitSystems.SI, config.unitSystems?.SI),
      IEC: mergeUnitSystem(localizedUnitSystems.IEC, config.unitSystems?.IEC),
    };
  }

  /** Formats a byte value using the configured locale and measurement system. */
  format(value: number, options: FileSizeFormatOptions = {}): string {
    if (!Number.isFinite(value)) {
      throw new Error(INVALID_VALUE_ERROR);
    }

    const precision = this.resolvePrecision(
      options.precision,
      this.defaultPrecision
    );

    const unitSystem = options.unitSystem ?? this.defaultUnitSystem;

    const formattedSize = getHumanizedSize(
      value,
      this.unitSystems[unitSystem],
      precision
    );

    // Same digit rules as numbers in running text, as in Koobiq Angular
    // `kbqDataSize`. A grouping set in the config overrides them.
    const digitsInfo =
      this.useGrouping === undefined
        ? `1.0-${precision}`
        : `1.0-${precision}-${this.useGrouping}`;

    const formattedValue = this.decimalFormatter.format(
      formattedSize.value,
      digitsInfo
    );

    return `${formattedValue}${NON_BREAKING_SPACE}${formattedSize.unit}`;
  }

  private resolvePrecision(
    precision: number | undefined,
    fallback: number
  ): number {
    if (precision === undefined) return fallback;

    if (
      process.env.NODE_ENV !== 'production' &&
      !isPrecisionInRange(precision)
    ) {
      once.warn(FILE_SIZE_FORMATTER_ERROR_PRECISION_RANGE);
    }

    return clampPrecision(precision, fallback);
  }
}
