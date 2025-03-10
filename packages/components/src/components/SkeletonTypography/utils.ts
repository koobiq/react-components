import type { CSSProperties } from 'react';

export const getRowWidth = (
  idx: number,
  rows: number = 0
): CSSProperties['inlineSize'] => {
  if (!rows) return '100%';

  // The size of the last row.
  if (idx === rows - 1) {
    return '50%';
  }

  // eslint-disable-next-line default-case
  switch (idx % 3) {
    // The first, fourth etc.
    case 0:
      return '95%';
    // The second, fifth etc.
    case 1:
      return '100%';
    // The third, sixth etc.
    case 2:
      return '90%';
  }

  return '100%';
};
