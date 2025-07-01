import type { BadgePropVariant } from '@koobiq/react-components';

import type { StatusPropVariant } from './types';

export const variantMap: Record<
  StatusPropVariant,
  { variant: BadgePropVariant; children: string }
> = {
  stable: { variant: 'success', children: 'Stable' },
  experimental: { variant: 'theme', children: 'Experimental' },
  deprecated: { variant: 'error', children: 'Deprecated' },
  draft: { variant: 'warning', children: 'Draft' },
};
