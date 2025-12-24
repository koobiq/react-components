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
  filterDOMProps,
} from '@koobiq/react-core';
import {
  removeDataAttributes,
  useBreadcrumbItem,
} from '@koobiq/react-primitives';

import { useBreadcrumbsContext } from '../../BreadcrumbsContext';

import s from './BreadcrumbItem.module.css';
import type { BreadcrumbItemBaseProps } from './types';

export const BreadcrumbItem = polymorphicForwardRef<
  'span',
  BreadcrumbItemBaseProps
>((props, ref) => {
  const domRef = useDOMRef(ref);

  const {
    as = 'span',
    children,
    endAddon,
    isCurrent,
    startAddon,
    isDisabled,
    className,
    style,
    ...other
  } = props;

  let { itemProps } = useBreadcrumbItem(
    {
      ...removeDataAttributes(props),
      children: props.children || null,
      elementType: props.href ? 'a' : `${as}`,
    },
    domRef
  );

  const Tag = props.href ? 'a' : as;

  const { size } = useBreadcrumbsContext();

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { focusProps, isFocusVisible } = useFocusRing({});

  const { isPressed, pressProps } = usePress({ isDisabled });

  const DOMProps = filterDOMProps(props);
  delete DOMProps.id;

  if (as !== 'a' && as !== 'span') {
    itemProps = other;
  }

  return (
    <Tag
      className={clsx(
        s.base,
        s[size],
        isHovered && s.hovered,
        isCurrent && s.current,
        isPressed && s.pressed,
        isDisabled && s.disabled,
        isFocusVisible && s.focusVisible,
        className
      )}
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-current={isCurrent || undefined}
      data-disabled={isDisabled || undefined}
      data-focus-visible={isFocusVisible || undefined}
      {...mergeProps(DOMProps, itemProps, hoverProps, focusProps, pressProps)}
      style={style}
      ref={domRef}
    >
      {isNotNil(startAddon) && startAddon}
      {children}
      {isNotNil(endAddon) && endAddon}
    </Tag>
  );
});

export type BreadcrumbItemProps<As extends ElementType = 'span'> =
  ComponentPropsWithRef<typeof BreadcrumbItem<As>>;
