import { isNumber } from '@koobiq/react-core';

import type { SkeletonBlockBaseProps } from './types';

export const normalizeSize = (
  value: SkeletonBlockBaseProps['blockSize'] | undefined
) => {
  if (isNumber(value)) return `${value}px`;

  return value;
};
