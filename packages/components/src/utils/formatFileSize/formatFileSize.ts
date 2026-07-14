export const fileSizeUnit = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export type FileSizeUnit = (typeof fileSizeUnit)[number];

export type FileSizeUnitLabels = Record<FileSizeUnit, string>;

export type FormatFileSizeOptions = {
  /**
   * Locale-aware number formatter, e.g. the `format` method from React Aria's
   * `useNumberFormatter`. When omitted, a default `Intl.NumberFormat` is used.
   */
  formatNumber?: (value: number) => string;
  /** Localized unit labels. Defaults to English abbreviations (`B`, `KB`, …). */
  unitLabels?: Partial<FileSizeUnitLabels>;
  /**
   * Maximum fraction digits, used only when `formatNumber` is not provided.
   * @default 2
   */
  maximumFractionDigits?: number;
};

const defaultUnitLabels: FileSizeUnitLabels = {
  B: 'B',
  KB: 'KB',
  MB: 'MB',
  GB: 'GB',
  TB: 'TB',
};

const BASE = 1024;

/**
 * Formats a byte count into a human-readable file size (e.g. `145.42 KB`).
 *
 * The number is scaled to the largest unit that keeps the value `>= 1` (base
 * 1024) and formatted with the provided locale-aware formatter. The value and
 * unit are joined with a non-breaking space so they never wrap apart.
 */
export function formatFileSize(
  bytes: number,
  options: FormatFileSizeOptions = {}
): string {
  const { formatNumber, unitLabels, maximumFractionDigits = 2 } = options;
  const labels = { ...defaultUnitLabels, ...unitLabels };

  const safeBytes = Number.isFinite(bytes) && bytes > 0 ? bytes : 0;

  const exponent =
    safeBytes === 0
      ? 0
      : Math.min(
          Math.floor(Math.log(safeBytes) / Math.log(BASE)),
          fileSizeUnit.length - 1
        );

  const value = safeBytes / BASE ** exponent;

  const formatted = formatNumber
    ? formatNumber(value)
    : new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);

  return `${formatted}\u00a0${labels[fileSizeUnit[exponent]]}`;
}
