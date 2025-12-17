'use client';

import { useRef } from 'react';

import {
  clsx,
  useFocusRing,
  useHover,
  mergeProps,
  usePress,
} from '@koobiq/react-core';
import { useBreadcrumbItem } from '@koobiq/react-primitives';

import { useBreadcrumbsContext } from '../../BreadcrumbsContext';

import s from './BreadcrumbItem.module.css';
import type { BreadcrumbItemProps } from './types';

export const BreadcrumbItem = (props: BreadcrumbItemProps) => {
  const ref = useRef(null);

  const { isDisabled, isCurrent, children } = props;

  const { itemProps } = useBreadcrumbItem(
    { ...props, elementType: 'span' },
    ref
  );

  const { size } = useBreadcrumbsContext();

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { focusProps, isFocusVisible } = useFocusRing({});

  const { isPressed, pressProps } = usePress({ isDisabled });

  return (
    <span
      className={clsx(
        s.base,
        s[size],
        isHovered && s.hovered,
        isCurrent && s.current,
        isPressed && s.pressed,
        isDisabled && s.disabled,
        isFocusVisible && s.focusVisible
      )}
      {...mergeProps(itemProps, hoverProps, focusProps, pressProps)}
      ref={ref}
    >
      {children}
    </span>
  );
};
