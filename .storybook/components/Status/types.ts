import type { BadgeBaseProps } from '@koobiq/react-components';

import type { ExtendableProps } from '../../../packages/core';

export const statusPropVariant = [
  'stable',
  'experimental',
  'deprecated',
  'draft',
] as const;

export type StatusPropVariant = (typeof statusPropVariant)[number];

export type StatusProps = ExtendableProps<
  {
    variant?: StatusPropVariant;
  },
  BadgeBaseProps
>;
