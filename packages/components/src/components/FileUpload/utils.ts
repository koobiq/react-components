import { FILE_NAME_TAIL_LENGTH } from './constants';
import type { FileItem, FileWithPath } from './types';

/** Wraps a native `File` into a `FileItem` (loading off, progress 0). */
export const mapToFileItem = (file: File): FileItem => ({
  file,
  loading: false,
  progress: 0,
});

// SI unit abbreviations (base 1000), matching the Angular `KbqDataSizePipe`
// default unit system (`defaultUnitSystem: 'SI'`). Russian localizes the labels
// to Cyrillic, mirroring the pipe's per-locale `sizeUnits` table; every other
// bundled locale keeps the Latin labels.
const DATA_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
const DATA_SIZE_UNITS_RU = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'] as const;

// SI base and default precision, matching `KbqDataSizePipe` (`base: 10, power: 3`
// → 1000; `defaultPrecision: 2`). The pipe joins value and unit with a
// non-breaking space, so we do the same.
const DATA_SIZE_BASE = 1000;
const DATA_SIZE_MAX_PRECISION = 2;
const NON_BREAKING_SPACE = '\u00A0';

/**
 * Formats a byte count into a localized, human-readable size string, matching
 * the Angular `KbqDataSizePipe` SI defaults: base 1000, up to 2 fraction digits
 * (trailing zeros dropped), a non-breaking space separator, and Cyrillic unit
 * labels under `ru`. Unlike the pipe (which throws on non-finite input), this
 * returns an empty string so it stays render-safe.
 */
export const formatDataSize = (bytes: number, locale?: string): string => {
  if (!Number.isFinite(bytes)) {
    return '';
  }

  const units = locale?.toLowerCase().startsWith('ru')
    ? DATA_SIZE_UNITS_RU
    : DATA_SIZE_UNITS;

  let value = bytes;
  let unitIndex = 0;

  while (value >= DATA_SIZE_BASE && unitIndex < units.length - 1) {
    value /= DATA_SIZE_BASE;
    unitIndex += 1;
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: DATA_SIZE_MAX_PRECISION,
  }).format(value);

  return `${formatted}${NON_BREAKING_SPACE}${units[unitIndex]}`;
};

/** Splits a file name into a head (truncatable) and a preserved tail. */
export const centerEllipsisParts = (
  name: string,
  tailLength = FILE_NAME_TAIL_LENGTH
): { head: string; tail: string } => {
  if (name.length <= tailLength) {
    return { head: '', tail: name };
  }

  return {
    head: name.slice(0, name.length - tailLength),
    tail: name.slice(name.length - tailLength),
  };
};

/** Returns the leading part of a caption template, before the given placeholder. */
export const splitBefore = (template: string, placeholder: string): string =>
  template.split(placeholder)[0] ?? template;

/** Determines whether a pointer position falls outside the given bounds. */
export const isOutsideViewport = (params: {
  clientX: number;
  clientY: number;
  innerWidth: number;
  innerHeight: number;
  xAxisMinThreshold: number;
  yAxisMinThreshold: number;
}): boolean => {
  const {
    clientX,
    clientY,
    innerWidth,
    innerHeight,
    xAxisMinThreshold,
    yAxisMinThreshold,
  } = params;

  return (
    clientX <= xAxisMinThreshold ||
    clientY <= yAxisMinThreshold ||
    clientX >= innerWidth ||
    clientY >= innerHeight
  );
};

/** Whether the current browser is Safari (drag `relatedTarget` is unreliable there). */
export const isSafari = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
};

/** Whether the browser supports reading dropped directory entries. */
export const isFolderDragSupported = (): boolean =>
  typeof DataTransferItem !== 'undefined' &&
  'webkitGetAsEntry' in DataTransferItem.prototype;

const entryIsDirectory = (
  entry: FileSystemEntry | undefined
): entry is FileSystemDirectoryEntry => !!entry && entry.isDirectory;

const entryIsFile = (
  entry: FileSystemEntry | undefined
): entry is FileSystemFileEntry => !!entry && entry.isFile;

/**
 * Recursively expands a dropped entry into a flat list of files, stamping each
 * with its full path within the dropped tree. Ported from the Angular
 * `KbqDrop.unwrapDirectory` iterative BFS.
 */
export const unwrapDirectory = async (
  item: FileSystemEntry
): Promise<FileWithPath[]> => {
  const queue: (FileSystemEntry | Promise<FileSystemEntry[]>)[] = [item];
  const result: Promise<FileWithPath>[] = [];

  while (queue.length > 0) {
    const next = queue.pop();

    if (next instanceof Promise) {
      queue.push(...(await next));
    } else if (entryIsDirectory(next)) {
      const reader = next.createReader();

      queue.push(
        new Promise<FileSystemEntry[]>((resolve, reject) =>
          reader.readEntries(resolve, reject)
        )
      );
    } else if (entryIsFile(next)) {
      const fileEntry = next;

      result.push(
        new Promise<FileWithPath>((resolve, reject) => {
          fileEntry.file((file) => {
            const withPath = file as FileWithPath;

            withPath.fullPath = fileEntry.fullPath;
            resolve(withPath);
          }, reject);
        })
      );
    }
  }

  return Promise.all(result);
};

/**
 * Extracts dropped files from a `DataTransfer`, recursively expanding any
 * directories. `accept` is intentionally not applied here.
 */
export const extractDroppedFiles = async (
  dataTransfer: DataTransfer
): Promise<FileWithPath[]> => {
  const entries = Array.from(dataTransfer.items)
    .filter((item) => item.kind === 'file')
    .map((item) => item.webkitGetAsEntry())
    .filter((entry): entry is FileSystemEntry => entry != null);

  const groups = await Promise.all(entries.map(unwrapDirectory));

  return groups.reduce<FileWithPath[]>((acc, group) => acc.concat(group), []);
};
