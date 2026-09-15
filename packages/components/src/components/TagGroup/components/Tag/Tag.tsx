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

  const { focusProps, isFocusVisible } = useFocusRing({ within: false });

  const {
    rowProps,
    isDisabled,
    gridCellProps,
    allowsRemoving,
    removeButtonProps: removeButtonPropsAria,
  } = useTag(props, state, ref);

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const rootProps = {
    ...mergeProps(
      rowProps,
      hoverProps,
      focusProps,
      { style, className },
      // `slotProps.root` is the escape hatch, so it wins over `style`/`className`
      slotProps?.root,
      { ref }
    ),
    // The interaction state drives the styling, so it is assigned after the
    // merge rather than inside it: `mergeProps` keeps the earlier value when
    // the later one is `undefined`, which would let a consumer pin a state
    // attribute on and desync the visuals from the real state.
    'data-hovered': isHovered || undefined,
    'data-focus-visible': isFocusVisible || undefined,
    'aria-disabled': isDisabled || undefined,
  };

  // `tabIndex` first (`useTag` doesn't set it), then React Aria — its
  // `isDisabled` is ungated by `disabledBehavior` and must not be overridden
  // by the wrapper — then the consumer's slot props.
  const removeIconProps = allowsRemoving
    ? mergeProps<
        [
          TagRemoveButtonProps,
          TagRemoveButtonProps,
          TagRemoveButtonProps | undefined,
        ]
      >({ tabIndex: -1 }, removeButtonPropsAria, slotProps?.removeIcon)
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
