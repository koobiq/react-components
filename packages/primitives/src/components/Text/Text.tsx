'use client';

import type { ComponentPropsWithRef, ComponentRef, ElementType } from 'react';

import { polymorphicForwardRef } from '@koobiq/react-core';

import { useContextProps } from '../../utils';

import { type TextBaseProps, TextContext } from './index';

export const Text = polymorphicForwardRef<'p', TextBaseProps>((props, ref) => {
  const [ctxProps, ctxRef] = useContextProps(props, ref, TextContext);

  const { as: Tag = 'p', children, ...other } = ctxProps;

  return (
    <Tag {...other} ref={ctxRef}>
      {children}
    </Tag>
  );
});

Text.displayName = 'Text';

export type TextProps<As extends ElementType = 'p'> = ComponentPropsWithRef<
  typeof Text<As>
>;

export type TextRef = ComponentRef<'p'>;
