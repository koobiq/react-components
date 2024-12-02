import type { BadgePropVariant } from '@koobiq/react-components';

import type { StatusPropVariant } from './types';

export const variantMap: Record<
  StatusPropVariant,
  { variant: BadgePropVariant; label: string }
> = {
  stable: { variant: 'success', label: 'Stable' },
  experimental: { variant: 'theme', label: 'Experimental' },
  deprecated: { variant: 'error', label: 'Deprecated' },
  draft: { variant: 'warning', label: 'Draft' },
};
