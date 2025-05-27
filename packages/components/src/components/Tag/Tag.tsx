import type { ComponentPropsWithRef, ElementType } from 'react';

import {
  polymorphicForwardRef,
  useFocusRing,
  mergeProps,
  clsx,
  useHover,
  isNotNil,
} from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';
import { useLocalizedStringFormatter } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { IconButton } from '../IconButton';

import intlMessages from './intl.json';
import s from './Tag.module.css';
import type { TagBaseProps } from './types';
import { matchVariantToCloseButton } from './utils';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export const Tag = polymorphicForwardRef<'div', TagBaseProps>((props, ref) => {
  const {
    as: Tag = 'div',
    variant = 'theme-fade',
    isDisabled = false,
    label,
    icon,
    onClose,
    slotProps,
    ...other
  } = props;

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  const { hoverProps, isHovered } = useHover(props);

  const { focusProps, isFocusVisible, isFocused } = useFocusRing({
    within: false,
  });

  const tagProps = mergeProps(
    {
      className: clsx(
        s.base,
        s[variant],
        isFocused && s.focused,
        isHovered && s.hovered,
        isDisabled && s.disabled,
        textNormalMedium
      ),
      'data-variant': variant,
      'data-focused': isFocused,
      'data-hovered': isHovered,
      'aria-disabled': isDisabled,
      'data-disabled': isDisabled,
      'data-focus-visible': isFocusVisible,
      ...(!isDisabled && { tabIndex: -1 }),
      ...other,
      ref,
    },

    focusProps,
    hoverProps
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

  const closeIcon = mergeProps(
    {
      'aria-label': stringFormatter.format('close'),
      size: 'l',
      tabIndex: -1,
      variant: matchVariantToCloseButton[variant],
      disabled: isDisabled,
      className: s.cancelIcon,
      onPress: onClose,
      compact: true,
    },
    slotProps?.closeIcon
  );

  return (
    <Tag {...tagProps}>
      {isNotNil(icon) && (
        <span {...iconProps}>{iconProps.children ?? icon}</span>
      )}
      {isNotNil(label) && (
        <span {...contentProps}>{contentProps.children ?? label}</span>
      )}
      {isNotNil(onClose) && typeof onClose === 'function' && (
        <IconButton {...closeIcon}>
          {closeIcon.children || <IconXmarkS16 />}
        </IconButton>
      )}
    </Tag>
  );
});

export type TagProps<As extends ElementType = 'div'> = ComponentPropsWithRef<
  typeof Tag<As>
>;
