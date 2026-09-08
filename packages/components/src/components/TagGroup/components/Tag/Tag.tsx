'use client';

import { useRef } from 'react';

import { useFocusRing, mergeProps, useHover } from '@koobiq/react-core';
import type { AriaTagProps, ListState } from '@koobiq/react-primitives';
import { useTag } from '@koobiq/react-primitives';

import { Tag as BaseTag, type TagRemoveButtonProps } from '../../../Tag';
import type {
  TagGroupPropVariant,
  TagProps as RootTagProps,
} from '../../index';

type TagProps<T> = AriaTagProps<T> & {
  state: ListState<T>;
  /**
   * The variant to use.
   * @default 'theme-fade'
   */
  variant?: TagGroupPropVariant;
};

export function Tag<T>(props: TagProps<T>) {
  const { item, state, variant = 'theme-fade' } = props;
  const { slotProps, icon, className, style } = item.props as RootTagProps<T>;
  const ref = useRef(null);

  const { focusProps, isFocusVisible, isFocused } = useFocusRing({
    within: false,
  });

  const {
    rowProps,
    isPressed,
    isDisabled,
    gridCellProps,
    allowsRemoving,
    removeButtonProps: removeButtonPropsAria,
  } = useTag(props, state, ref);

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const rootProps = mergeProps(
    rowProps,
    hoverProps,
    focusProps,
    {
      'data-focused': isFocused || undefined,
      'data-pressed': isPressed || undefined,
      'data-hovered': isHovered || undefined,
      'data-focus-visible': isFocusVisible || undefined,
      'aria-disabled': isDisabled || undefined,
    },
    slotProps?.root,
    { ref, style, className }
  );

  const removeIconProps = allowsRemoving
    ? mergeProps<(TagRemoveButtonProps | undefined)[]>(
        removeButtonPropsAria,
        {
          isDisabled,
          tabIndex: -1,
        },
        slotProps?.removeIcon
      )
    : undefined;

  return (
    <BaseTag
      {...rootProps}
      icon={icon}
      variant={variant}
      allowsRemoving={allowsRemoving}
      isDisabled={isDisabled}
      slotProps={{
        body: gridCellProps,
        icon: slotProps?.icon,
        content: slotProps?.content,
        removeIcon: removeIconProps,
      }}
    >
      {item.rendered}
    </BaseTag>
  );
}
