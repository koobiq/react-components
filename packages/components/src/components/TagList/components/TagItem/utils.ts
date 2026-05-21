import type { Node } from '@koobiq/react-core';

import type { IconButtonPropVariant } from '../../../IconButton';
import type { TagProps } from '../../Tag';
import type { TagListPropVariant } from '../../types';

export function getTagListItemProps<T extends object>(node: Node<T>) {
  return node.props as TagProps<T>;
}

export const matchVariantToIconButton: Record<
  TagListPropVariant,
  IconButtonPropVariant
> = {
  'theme-fade': 'theme',
  'contrast-fade': 'fade-contrast',
  'error-fade': 'error',
  'warning-fade': 'warning',
};
