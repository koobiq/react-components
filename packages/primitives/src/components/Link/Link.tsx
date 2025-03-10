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

  const domRef = useDOMRef<ComponentRef<'a'>>(ref);

  const { hovered, pressed, focused, focusVisible, linkProps } = useLink(
    commonProps,
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
    <Tag {...mergeProps(linkProps, renderProps)} ref={ref}>
      {renderProps.children}
    </Tag>
  );
});

Link.displayName = 'Link';
