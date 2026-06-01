import type { Key, Node as CollectionNode } from '@koobiq/react-core';
import {
  clsx,
  isNotNil,
  mergeProps,
  useFocusRing,
  useHover,
} from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';
import type { ListState } from '@koobiq/react-primitives';
import { useTagListItem } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { IconButton } from '../../../IconButton';
import type { IconButtonProps } from '../../../IconButton';
import type { TagProps } from '../../Tag';
import type { TagListPropVariant } from '../../types';

import s from './TagItem.module.css';
import { matchVariantToIconButton } from './utils';

type TagItemProps<T extends object> = {
  state: ListState<T>;
  item: CollectionNode<T>;
  variant: TagListPropVariant;
  onRemove?: (keys: Set<Key>) => void;
  isDisabled?: boolean;
  collectionId?: string;
};

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function TagItem<T extends object>(props: TagItemProps<T>) {
  const {
    item,
    onRemove,
    state,
    isDisabled: isDisabledProp,
    variant: groupVariant,
    collectionId,
  } = props;

  const itemProps = item.props as TagProps<T>;
  const variant = itemProps.variant ?? groupVariant;

  const {
    tagProps,
    isPressed,
    isSelected,
    isDisabled,
    gridCellProps,
    allowsRemoving,
    removeButtonProps: removeButtonPropsAria,
  } = useTagListItem({
    item,
    onRemove,
    state,
    isDisabled: isDisabledProp,
    collectionId,
  });

  const { focusProps, isFocusVisible, isFocused } = useFocusRing({
    within: false,
  });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const {
    icon,
    style,
    className,
    slotProps,
    'data-testid': testId,
  } = itemProps;

  const rootProps = mergeProps(
    tagProps,
    hoverProps,
    focusProps,
    slotProps?.root,
    {
      style,
      className: clsx(
        s.base,
        s[variant],
        textNormalMedium,
        isHovered && s.hovered,
        isSelected && s.selected,
        isDisabled && s.disabled,
        isFocusVisible && s.focusVisible,
        className
      ),
      'data-testid': testId,
      'data-variant': variant,
      'data-focused': isFocused || undefined,
      'data-pressed': isPressed || undefined,
      'data-hovered': isHovered || undefined,
      'data-selected': isSelected || undefined,
      'data-disabled': isDisabled || undefined,
      'data-focus-visible': isFocusVisible || undefined,
    }
  );

  const removeButtonProps = mergeProps<
    [IconButtonProps, IconButtonProps | undefined, IconButtonProps]
  >(
    {
      isCompact: true,
      className: s.cancelIcon,
      variant: matchVariantToIconButton[variant],
    },
    slotProps?.removeIcon,
    removeButtonPropsAria
  );

  const contentProps = mergeProps({ className: s.content }, slotProps?.content);
  const iconProps = mergeProps({ className: s.icon }, slotProps?.icon);

  return (
    <div {...rootProps}>
      <div {...gridCellProps}>
        {isNotNil(icon) && <span {...iconProps}>{icon}</span>}
        {isNotNil(item.rendered) && (
          <span {...contentProps}>{item.rendered}</span>
        )}
        {allowsRemoving && (
          <IconButton size="l" {...removeButtonProps}>
            <IconXmarkS16 />
          </IconButton>
        )}
      </div>
    </div>
  );
}
