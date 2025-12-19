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
  isNotNil,
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

  const {
    as = 'a',
    children,
    endAddon,
    isCurrent,
    startAddon,
    isDisabled,
    onPress,
    ...other
  } = props;

  const { itemProps } = useBreadcrumbItem(
    {
      ...props,
      onPress,
      children: props.children || null,
      elementType: `${as}`,
    },
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
      {...other}
      ref={domRef}
    >
      {isNotNil(startAddon) && startAddon}
      {children}
      {isNotNil(endAddon) && endAddon}
    </Tag>
  );
});

export type BreadcrumbItemProps<As extends ElementType = 'a'> =
  ComponentPropsWithRef<typeof BreadcrumbItem<As>>;
