import { useRef } from 'react';

import {
  clsx,
  useFocusRing,
  mergeProps,
  useHover,
  isNotNil,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';
import type { AriaTagProps, ListState } from '@koobiq/react-primitives';
import { useTag } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { IconButton, type IconButtonProps } from '../../../IconButton';
import type { TagGroupPropVariant, TagProps } from '../../index';
import intlMessages from '../../intl.json';

import s from './TagInner.module.css';
import { matchVariantToCloseButton } from './utils';

export type TagInnerProps<T> = AriaTagProps<T> & {
  state: ListState<T>;
  /**
   * The variant to use.
   * @default 'theme-fade'
   */
  variant?: TagGroupPropVariant;
};

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function TagInner<T>(props: TagInnerProps<T>) {
  const { item, state, variant = 'theme-fade' } = props;
  const { slotProps, icon, className, style } = item.props as TagProps<T>;
  const ref = useRef(null);

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  const { focusProps, isFocusVisible, isFocused } = useFocusRing({
    within: false,
  });

  const {
    rowProps,
    gridCellProps,
    removeButtonProps: removeButtonPropsAria,
    allowsRemoving,
    isDisabled,
    isPressed,
  } = useTag(props, state, ref);

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const rootProps = mergeProps(
    {
      className: clsx(
        s.base,
        s[variant],
        isFocused && s.focused,
        isHovered && s.hovered,
        isDisabled && s.disabled,
        textNormalMedium,
        className
      ),
      style,
      'data-variant': variant,
      'data-focused': isFocused,
      'data-pressed': isPressed,
      'data-hovered': isHovered,
      'aria-disabled': isDisabled,
      'data-disabled': isDisabled,
      'data-focus-visible': isFocusVisible,
    },
    rowProps,
    hoverProps,
    focusProps,
    slotProps?.root
  );

  const removeButtonProps = mergeProps<
    [IconButtonProps, IconButtonProps, IconButtonProps | undefined]
  >(
    {
      tabIndex: -1,
      isCompact: true,
      isDisabled,
      className: s.cancelIcon,
      variant: matchVariantToCloseButton[variant],
      'aria-label': stringFormatter.format('close'),
    },
    removeButtonPropsAria,
    slotProps?.removeIcon
  );

  const contentProps = mergeProps(
    {
      className: s.content,
    },
    slotProps?.content
  );

  const iconProps = mergeProps(
    {
      className: s.icon,
    },
    slotProps?.icon
  );

  return (
    <div ref={ref} {...rootProps}>
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
