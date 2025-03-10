import { isNumber, isString } from '@koobiq/react-core';

import type {
  ContainerMarginsProp,
  ContainerMaxInlineSizeProp,
  ContainerPositionProp,
} from './types';

export const normalizeMargins = (value: ContainerMarginsProp | undefined) => {
  if (isString(value)) return `var(--kbq-size-${value})`;

  return value;
};

export const normalizeMaxInlineSize = (
  value: ContainerMaxInlineSizeProp | undefined
) => {
  if (isNumber(value)) return `${value}px`;

  return value;
};

export const normalizePosition = (value: ContainerPositionProp | undefined) => {
  if (value === 'start') return '0 auto';
  if (value === 'end') return 'auto 0';

  return 'auto';
};
