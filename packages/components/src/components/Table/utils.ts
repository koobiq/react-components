import { isNumber } from '@koobiq/react-core';

import type { TablePropBlockSize } from './types';

export const normalizeBlockSize = (value: TablePropBlockSize | undefined) => {
  if (isNumber(value)) return `${value}px`;

  return value;
};
