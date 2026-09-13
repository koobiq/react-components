import type { DescriptionListProps } from './types';

/** Converts `termWidth` to a CSS value, numbers are pixels. */
export function normalizeTermWidth(
  termWidth: DescriptionListProps['termWidth']
): string | undefined {
  return typeof termWidth === 'number' ? `${termWidth}px` : termWidth;
}
