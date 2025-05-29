'use client';

import type { ComponentRef } from 'react';

import {
  useDOMRef,
  mergeProps,
  polymorphicForwardRef,
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

  return (
    <Tag
      {...mergeProps(linkProps, renderProps)}
      tabIndex={props.tabIndex || linkProps.tabIndex}
      ref={domRef}
    >
      {renderProps.children}
    </Tag>
  );
});

Link.displayName = 'Link';
