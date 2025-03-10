import { isString } from '@koobiq/react-core';

import type { GridPropGap } from './types';

export const normalizeGap = (gap: GridPropGap | undefined) => {
  if (isString(gap)) return `var(--kbq-size-${gap})`;

  return gap;
};
