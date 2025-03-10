import { isNumber } from '@koobiq/react-core';

import type { PopoverPropSize } from './types';

export const normalizeInlineSize = (value: PopoverPropSize | undefined) => {
  if (value === 'small') return `240px`;
  if (value === 'medium') return `400px`;
  if (value === 'large') return `640px`;
  if (isNumber(value)) return `${value}px`;

  return value;
};
