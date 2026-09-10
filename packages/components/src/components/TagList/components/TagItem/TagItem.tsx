'use client';

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
  isReadOnly?: boolean;
  collectionId?: string;
};

export function TagItem<T extends object>(props: TagItemProps<T>) {
  const {
    item,
    onRemove,
    state,
    isDisabled: isDisabledProp,
    isReadOnly,
    variant: groupVariant,
    collectionId,
  } = props;

  const itemProps = item.props as TagProps<T>;
  const variant = itemProps.variant ?? groupVariant;
  const ref = useRef<HTMLDivElement>(null);

  const {
    rowProps,
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

  const { focusProps, isFocusVisible } = useFocusRing({ within: false });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const {
    icon,
    style,
    className,
    slotProps,
    'data-testid': testId,
  } = itemProps;

  // `rowProps` already carries `ref`, so it is not repeated here — merging it
  // twice would hand React a fresh callback ref on every render.
  const rootProps = {
    ...mergeProps(
      rowProps,
      hoverProps,
      focusProps,
      { style, className },
      // `slotProps.root` is the escape hatch, so it wins over `style`/`className`
      slotProps?.root,
      { 'data-testid': testId }
    ),
    // The interaction state drives the styling, so it is assigned after the
    // merge rather than inside it: `mergeProps` keeps the earlier value when
    // the later one is `undefined`, which would let a consumer pin a state
    // attribute on and desync the visuals from the real state.
    'data-hovered': isHovered || undefined,
    'data-selected': isSelected || undefined,
    'data-focus-visible': isFocusVisible || undefined,
  };

  // Same order as the TagGroup wrapper: React Aria's props win over the
  // defaults, the consumer's slot props win over both.
  const removeIconProps = allowsRemoving
    ? mergeProps<
        [
          TagRemoveButtonProps,
          TagRemoveButtonProps,
          TagRemoveButtonProps | undefined,
        ]
      >(
        { tabIndex: -1, isDisabled: isReadOnly || isDisabled },
        removeButtonPropsAria,
        slotProps?.removeIcon
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
