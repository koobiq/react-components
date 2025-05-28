import { useRef } from 'react';

import {
  clsx,
  useFocusRing,
  mergeProps,
  useHover,
  isNotNil,
} from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';
import type { AriaTagProps, ListState } from '@koobiq/react-primitives';
import { useTag } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { IconButton } from '../../../IconButton';
import type { TagGroupPropVariant } from '../../types';

import s from './TagInner.module.css';
import { matchVariantToCloseButton } from './utils';

export type TagInnerProps<T> = AriaTagProps<T> & {
  state: ListState<T>;
  /**
   * The variant to use.
   * @default theme-fade
   * */
  variant?: TagGroupPropVariant;
};

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export function TagInner<T>(props: TagInnerProps<T>) {
  const { item, state, variant = 'theme-fade' } = props;
  const ref = useRef(null);

  const { focusProps, isFocusVisible, isFocused } = useFocusRing({
    within: false,
  });

  const {
    rowProps,
    gridCellProps,
    removeButtonProps: removeButtonPropsAria,
    allowsRemoving,
    isDisabled,
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
        textNormalMedium
      ),
      'data-variant': variant,
      'data-focused': isFocused,
      'data-hovered': isHovered,
      'aria-disabled': isDisabled,
      'data-disabled': isDisabled,
      'data-focus-visible': isFocusVisible,
    },
    rowProps,
    hoverProps,
    focusProps
  );

  const removeButtonProps = mergeProps(
    {
      tabIndex: -1,
      variant: matchVariantToCloseButton[variant],
      disabled: isDisabled,
      className: s.cancelIcon,
      compact: true,
    },
    removeButtonPropsAria
  );

  return (
    <div ref={ref} {...rootProps}>
      <div {...gridCellProps}>
        {isNotNil(item.props.icon) && (
          <span className={s.icon}>{item.props.icon}</span>
        )}
        {isNotNil(item.rendered) && (
          <span className={s.content}>{item.rendered}</span>
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
