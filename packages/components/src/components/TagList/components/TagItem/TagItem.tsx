import { useRef } from 'react';

import type { Key, Node as CollectionNode } from '@koobiq/react-core';
import { mergeProps, useFocusRing, useHover } from '@koobiq/react-core';
import type { ListState } from '@koobiq/react-primitives';
import { useTagListItem } from '@koobiq/react-primitives';

import { Tag as BaseTag, type TagRemoveButtonProps } from '../../../Tag';
import type { TagProps } from '../../Tag';
import type { TagListPropVariant } from '../../types';

type TagItemProps<T extends object> = {
  state: ListState<T>;
  item: CollectionNode<T>;
  variant: TagListPropVariant;
  onRemove?: (keys: Set<Key>) => void;
  isDisabled?: boolean;
  collectionId?: string;
};

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
  const ref = useRef<HTMLDivElement>(null);

  const {
    rowProps,
    isPressed,
    isSelected,
    isDisabled,
    gridCellProps,
    allowsRemoving,
    removeButtonProps: removeButtonPropsAria,
  } = useTagListItem(
    {
      key: item.key,
      onRemove,
      isDisabled: isDisabledProp,
      collectionId,
    },
    state,
    ref
  );

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
    rowProps,
    hoverProps,
    focusProps,
    {
      'data-testid': testId,
      'data-focused': isFocused || undefined,
      'data-pressed': isPressed || undefined,
      'data-hovered': isHovered || undefined,
      'data-selected': isSelected || undefined,
      'data-focus-visible': isFocusVisible || undefined,
    },
    slotProps?.root,
    { ref, style, className }
  );

  const removeIconProps = allowsRemoving
    ? mergeProps<[TagRemoveButtonProps | undefined, TagRemoveButtonProps]>(
        slotProps?.removeIcon,
        removeButtonPropsAria
      )
    : undefined;

  return (
    <BaseTag
      {...rootProps}
      icon={icon}
      variant={variant}
      isDisabled={isDisabled}
      slotProps={{
        body: gridCellProps,
        icon: slotProps?.icon,
        content: slotProps?.content,
        removeIcon: removeIconProps,
      }}
      allowsRemoving={allowsRemoving}
    >
      {item.rendered}
    </BaseTag>
  );
}
