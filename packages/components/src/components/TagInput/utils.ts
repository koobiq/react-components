// Converts a raw input string into normalized tag labels:
// split by the configured separator, trim whitespace, and drop empty tokens.
export const splitInputValue = (raw: string, splitPattern: RegExp): string[] =>
  raw
    .split(splitPattern)
    .map((s) => s.trim())
    .filter(Boolean);

// RegExp with the global/sticky flags keeps cursor state in lastIndex.
// Reset it before each test so repeated key/paste checks stay deterministic.
export const testSplitPattern = (
  splitPattern: RegExp,
  value: string
): boolean => {
  splitPattern.lastIndex = 0;

  return splitPattern.test(value);
};
