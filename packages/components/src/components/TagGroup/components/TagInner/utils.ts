import type { IconButtonPropVariant } from '../../../IconButton';
import type { TagGroupPropVariant } from '../../types';

export const matchVariantToCloseButton: Record<
  TagGroupPropVariant,
  IconButtonPropVariant
> = {
  'theme-fade': 'theme',
  'contrast-fade': 'fade-contrast',
  'error-fade': 'error',
  'warning-fade': 'warning',
};
