'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { polymorphicForwardRef } from '@koobiq/react-core';

import { useContextProps } from '../../utils';

import type { LabelBaseProps } from './index';
import { LabelContext } from './index';

export const Label = polymorphicForwardRef<'label', LabelBaseProps>(
  (props, ref) => {
    const [ctxProps, ctxRef] = useContextProps(props, ref, LabelContext);

    const { as: Tag = 'label', children, ...other } = ctxProps;

    return (
      <Tag {...other} ref={ctxRef}>
        {children}
      </Tag>
    );
  }
);

Label.displayName = 'Label';

export type LabelProps<As extends ElementType = 'label'> =
  ComponentPropsWithRef<typeof Label<As>>;
