import type { IconButtonPropVariant } from '../../../IconButton';
import type { TagListPropVariant } from '../../types';

export const matchVariantToIconButton: Record<
  TagListPropVariant,
  IconButtonPropVariant
> = {
  'theme-fade': 'theme',
  'contrast-fade': 'fade-contrast',
  'error-fade': 'error',
  'warning-fade': 'warning',
};
