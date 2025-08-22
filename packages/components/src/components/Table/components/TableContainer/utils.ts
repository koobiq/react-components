import { isNumber } from '@koobiq/react-core';

import type { TableContainerPropBlockSize } from './types';

export const normalizeBlockSize = (
  value: TableContainerPropBlockSize | undefined
) => {
  if (isNumber(value)) return `${value}px`;

  return value;
};
