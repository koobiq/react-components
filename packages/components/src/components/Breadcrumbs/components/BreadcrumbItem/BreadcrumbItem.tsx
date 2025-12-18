'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import {
  clsx,
  useFocusRing,
  useHover,
  mergeProps,
  usePress,
  useDOMRef,
  polymorphicForwardRef,
} from '@koobiq/react-core';
import { useBreadcrumbItem } from '@koobiq/react-primitives';

import { useBreadcrumbsContext } from '../../BreadcrumbsContext';

import s from './BreadcrumbItem.module.css';
import type { BreadcrumbItemBaseProps } from './types';

export const BreadcrumbItem = polymorphicForwardRef<
  'a',
  BreadcrumbItemBaseProps
>((props, ref) => {
  const domRef = useDOMRef(ref);

  const { isDisabled, isCurrent, children, as = 'a' } = props;

  const { itemProps } = useBreadcrumbItem(
    { ...props, elementType: `${as}` },
    domRef
  );

  const Tag = as;

  const { size } = useBreadcrumbsContext();

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { focusProps, isFocusVisible } = useFocusRing({});

  const { isPressed, pressProps } = usePress({ isDisabled });

  return (
    <Tag
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
    </Tag>
  );
});

export type BreadcrumbItemProps<As extends ElementType = 'a'> =
  ComponentPropsWithRef<typeof BreadcrumbItem<As>>;
