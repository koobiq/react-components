'use client';

import type { ComponentPropsWithRef, ComponentRef, ElementType } from 'react';

import { polymorphicForwardRef } from '@koobiq/react-core';

import { useSlottedContext } from '../../utils/useSlottedContext';

import { type TextBaseProps, TextContext } from './index';

export const Text = polymorphicForwardRef<'p', TextBaseProps>((props, ref) => {
  const { as: Tag = 'p', children, slot, ...other } = props;

  const commonProps = useSlottedContext(other, TextContext, slot);

  return (
    <Tag {...commonProps} ref={ref}>
      {children}
    </Tag>
  );
});

Text.displayName = 'Text';

export type TextProps<As extends ElementType = 'p'> = ComponentPropsWithRef<
  typeof Text<As>
>;

export type TextRef = ComponentRef<'p'>;
