'use client';

import type { ComponentPropsWithRef, ComponentRef, ElementType } from 'react';

import {
  useDOMRef,
  mergeProps,
  polymorphicForwardRef,
  filterDOMProps,
} from '@koobiq/react-core';

import { useLink } from '../../behaviors';
import { useRenderProps } from '../../utils';

import type { LinkBaseProps } from './types.js';

export const Link = polymorphicForwardRef<'a', LinkBaseProps>((props, ref) => {
  const { as: Tag = 'a', ...other } = props;

  const domRef = useDOMRef<ComponentRef<'a'>>(ref);

  const { isHovered, isPressed, isFocusVisible, isFocused, linkProps } =
    useLink(
      {
        ...other,
        ...(other.isDisabled && {
          onPress: undefined,
          onPressStart: undefined,
          onPressEnd: undefined,
          onPressChange: undefined,
          onPressUp: undefined,
          onKeyDown: undefined,
          onKeyUp: undefined,
          onClick: undefined,
          href: undefined,
        }),
      },
      domRef
    );

  const renderValues = {
    isHovered,
    isPressed,
    isFocused,
    isFocusVisible,
    isDisabled: props.isDisabled || false,
  };

  const renderProps = useRenderProps({
    ...props,
    values: renderValues,
  });

  const DOMProps = filterDOMProps(props, { global: true });
  delete DOMProps.onClick;

  return (
    <Tag
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-focused={isFocused || undefined}
      data-disabled={props.isDisabled || undefined}
      data-focus-visible={isFocusVisible || undefined}
      {...renderProps}
      {...mergeProps(DOMProps, linkProps)}
      {...('tabIndex' in props && { tabIndex: props.tabIndex })}
      ref={domRef}
    >
      {renderProps.children}
    </Tag>
  );
});

export type LinkProps<As extends ElementType = 'a'> = ComponentPropsWithRef<
  typeof Link<As>
>;

Link.displayName = 'Link';
