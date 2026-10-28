/** Digit options that a `digitsInfo` string resolves to. */
export type DecimalFormatterDigitsInfo = {
  /**
   * Whether to group the integer digits.
   * @default true
   */
  useGrouping: boolean;
  /**
   * The minimum number of integer digits.
   * @default 1
   */
  minimumIntegerDigits: number;
  /**
   * The minimum number of fraction digits.
   * @default 0
   */
  minimumFractionDigits: number;
  /**
   * The maximum number of fraction digits.
   * @default 3
   */
  maximumFractionDigits: number;
};

/** A value accepted by `DecimalFormatter`. Strings are coerced to numbers. */
export type DecimalFormatterValue = number | string | null | undefined;

const NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?(-(true|false))?)?$/;

const MIN_INT_GROUP_POSITION = 1;
const MIN_FRACTION_GROUP_POSITION = 3;
const MAX_FRACTION_GROUP_POSITION = 5;
const USE_GROUPING_POSITION = 7;

/**
 * Coerces `value` to a number the way Angular CDK `coerceNumberProperty` does.
 * Returns `null` for an empty value: `null`, `undefined`, `''` or `NaN`.
 */
export const toNumber = (value: DecimalFormatterValue): number | null => {
  if (value == null || value === '' || Number.isNaN(value)) return null;

  if (Number.isNaN(parseFloat(String(value))) || Number.isNaN(Number(value))) {
    throw new Error(`DecimalFormatter: ${value} is not a number`);
  }

  return Number(value);
};

/**
 * Parses `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}-{useGrouping}`.
 * Only the parts present in the string end up in the result.
 */
export const parseDigitsInfo = (
  digitsInfo: string
): Partial<DecimalFormatterDigitsInfo> => {
  const parts = digitsInfo.match(NUMBER_FORMAT_REGEXP);

  if (parts === null) {
    throw new Error(
      `DecimalFormatter: ${digitsInfo} is not a valid digit info`
    );
  }

  const minIntPart = parts[MIN_INT_GROUP_POSITION];
  const minFractionPart = parts[MIN_FRACTION_GROUP_POSITION];
  const maxFractionPart = parts[MAX_FRACTION_GROUP_POSITION];
  const useGroupingPart = parts[USE_GROUPING_POSITION];

  const result: Partial<DecimalFormatterDigitsInfo> = {};

  if (minIntPart != null) {
    result.minimumIntegerDigits = parseInt(minIntPart, 10);
  }

  if (minFractionPart != null) {
    result.minimumFractionDigits = parseInt(minFractionPart, 10);
  }

  if (maxFractionPart != null) {
    result.maximumFractionDigits = parseInt(maxFractionPart, 10);
  }

  if (useGroupingPart != null) {
    result.useGrouping = useGroupingPart === 'true';
  }

  return result;
};

/** Overlays the defined `overrides` on `defaults`; `undefined` keeps the default. */
export const withDefaults = <T extends object>(
  defaults: T,
  overrides?: Partial<T>
): T => ({
  ...defaults,
  ...Object.fromEntries(
    Object.entries(overrides ?? {}).filter(([, value]) => value !== undefined)
  ),
});

/** Formats with `formatter`, replacing the locale group separator if one is given. */
export const formatWithGroupSeparator = (
  value: number,
  formatter: Intl.NumberFormat,
  groupSeparator?: string
): string => {
  if (groupSeparator === undefined) return formatter.format(value);

  return formatter
    .formatToParts(value)
    .map((part) => (part.type === 'group' ? groupSeparator : part.value))
    .join('');
};

const ROUNDING_UNITS = {
  thousand: 1e3,
  million: 1e6,
  billion: 1e9,
  trillion: 1e12,
} as const;

/** A unit that `formatRounded` abbreviates to. */
export type RoundingUnit = keyof typeof ROUNDING_UNITS;

/** The rounded value split into the parts `formatRounded` joins. */
export type RoundedParts = { num: number; fraction?: number };

// Ported as is from Koobiq Angular `KbqRoundDecimalPipe`, quirks included, so
// both libraries print the same string for the same number.
const INTERVAL_LOCALES = ['ru-RU', 'en-US', 'es-LA', 'pt-BR'];

const INTERVALS: Array<{
  startRange: number;
  endRange: number;
  precision?: number;
}> = [
  { startRange: 1, endRange: ROUNDING_UNITS.thousand },
  {
    startRange: ROUNDING_UNITS.thousand,
    endRange: ROUNDING_UNITS.thousand * 10,
    precision: 1,
  },
  {
    startRange: ROUNDING_UNITS.thousand * 10,
    endRange: ROUNDING_UNITS.million,
  },
  {
    startRange: ROUNDING_UNITS.million,
    endRange: ROUNDING_UNITS.million * 10,
    precision: 1,
  },
  {
    startRange: ROUNDING_UNITS.million * 10,
    endRange: ROUNDING_UNITS.billion,
  },
];

const isWithin = (startRange: number, endRange: number, value: number) =>
  startRange <= value && value < endRange;

/** The largest unit that `value` reaches, or `undefined` below a thousand. */
export const getRoundingUnit = (value: number): RoundingUnit | undefined => {
  let unit: RoundingUnit | undefined;

  for (const key of Object.keys(ROUNDING_UNITS) as RoundingUnit[]) {
    if (value / ROUNDING_UNITS[key] < 1) break;

    unit = key;
  }

  return unit;
};

const getTruncatedParts = (value: number, divider: number): RoundedParts => ({
  num: Math.trunc(value / divider),
  fraction: Math.round(((value / divider) % 1) * 10),
});

/**
 * 2 * 1000 is a number in the interval of [1500...2500)
 *
 * 2,0 * 1000 is a number in the interval of [1950...2050)
 */
const getThousandsParts = (value: number): RoundedParts => {
  const dividedValue = value / ROUNDING_UNITS.thousand;
  const rounded = Math.round(dividedValue) * ROUNDING_UNITS.thousand;
  const fifty = 50;

  return isWithin(rounded - fifty, rounded + fifty, value)
    ? { num: Math.round(dividedValue), fraction: 0 }
    : { num: Math.round(dividedValue) };
};

/** Splits `value` into the integer and the fraction shown before `unit`. */
export const getRoundedParts = (
  value: number,
  unit: RoundingUnit,
  locale: string
): RoundedParts => {
  const divider = ROUNDING_UNITS[unit];

  if (INTERVAL_LOCALES.includes(locale)) {
    const interval = INTERVALS.find(({ startRange, endRange }) =>
      isWithin(startRange, endRange, value)
    );

    if (interval?.precision) {
      return unit === 'thousand'
        ? getThousandsParts(value)
        : getTruncatedParts(value, divider);
    }

    if (interval) return { num: Math.round(value / divider) };
  }

  return getTruncatedParts(value, divider);
};
