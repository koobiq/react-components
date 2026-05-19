import type { Node } from '@koobiq/react-core';

import type { IconButtonPropVariant } from '../../../IconButton';
import type { ItemProps } from '../../Tag';
import type { TagGroupNextPropVariant } from '../../types';

export function getTagGroupNextItemProps<T extends object>(node: Node<T>) {
  return node.props as ItemProps<T>;
}

export const matchVariantToIconButton: Record<
  TagGroupNextPropVariant,
  IconButtonPropVariant
> = {
  'theme-fade': 'theme',
  'contrast-fade': 'fade-contrast',
  'error-fade': 'error',
  'warning-fade': 'warning',
};
