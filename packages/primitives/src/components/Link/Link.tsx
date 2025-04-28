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
  const { as: Tag = 'a', ...commonProps } = props;

  const { disabled } = commonProps;

  const domRef = useDOMRef<ComponentRef<'a'>>(ref);

  const { hovered, pressed, focused, focusVisible, linkProps } = useLink(
    {
      ...commonProps,
      ...(disabled && {
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
      disabled,
    },
    domRef
  );

  const renderValues = {
    hovered,
    pressed,
    focused,
    focusVisible,
    disabled: props.disabled || false,
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
