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

import { utilClasses } from '../../styles/utility';
import { IconButton } from '../IconButton';

import s from './Tag.module.css';
import type { TagBaseProps } from './types';
import { matchVariantToCloseButton } from './utils';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export const Tag = polymorphicForwardRef<'div', TagBaseProps>((props, ref) => {
  const {
    as: Tag = 'div',
    variant = 'theme-fade',
    isDisabled = false,
    children,
    icon,
    onCancel,
    ...other
  } = props;

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
      tabIndex: -1,
      ...other,
      ref,
    },

    focusProps,
    hoverProps
  );

  return (
    <Tag {...tagProps}>
      {isNotNil(icon) && <span className={s.icon}>{icon}</span>}
      {isNotNil(children) && <span className={s.content}>{children}</span>}
      {isNotNil(onCancel) && typeof onCancel === 'function' && (
        <IconButton
          size="l"
          variant={matchVariantToCloseButton[variant]}
          disabled={isDisabled}
          className={s.cancelIcon}
          onPress={onCancel}
          compact
        >
          <IconXmarkS16 />
        </IconButton>
      )}
    </Tag>
  );
});

export type TagProps<As extends ElementType = 'div'> = ComponentPropsWithRef<
  typeof Tag<As>
>;
