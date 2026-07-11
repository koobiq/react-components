import type { FileExtensionMismatchError, MaxFileSizeError } from './types';

/**
 * Returns a validator that fails when a file exceeds `max` bytes.
 * Error shape mirrors the Angular `FileValidators.maxFileSize`.
 */
export const maxFileSize =
  (max: number) =>
  (file: File): MaxFileSizeError | null =>
    file.size > max ? { maxFileSize: { max, actual: file.size } } : null;

/**
 * Returns a validator that fails when a file matches none of the `expected`
 * specifiers. Specifiers may be extensions (`.png`), MIME types (`image/png`),
 * or MIME wildcards (`image/*`). Error shape mirrors the Angular
 * `FileValidators.isCorrectExtension`.
 */
export const isCorrectExtension =
  (expected: string[]) =>
  (file: File): FileExtensionMismatchError | null => {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    const matches = expected.some((raw) => {
      const spec = raw.toLowerCase().trim();

      if (spec.startsWith('.')) {
        return name.endsWith(spec);
      }

      if (spec.endsWith('/*')) {
        return type.startsWith(spec.slice(0, -1));
      }

      return type === spec;
    });

    return matches
      ? null
      : { fileExtensionMismatch: { expected, actual: file.name } };
  };
