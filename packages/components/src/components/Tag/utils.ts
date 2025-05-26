import type { IconButtonPropVariant } from '../IconButton';

import type { TagPropVariant } from './types';

export const matchVariantToCloseButton: Record<
  TagPropVariant,
  IconButtonPropVariant
> = {
  'theme-fade': 'theme',
  'contrast-fade': 'fade-contrast',
  'error-fade': 'error',
  'warning-fade': 'warning',
};
