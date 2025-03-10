'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';
import { useContext } from 'react';

import { polymorphicForwardRef, mergeProps } from '@koobiq/react-core';

import type { LabelBaseProps } from './index';
import { LabelContext } from './index';

export const Label = polymorphicForwardRef<'label', LabelBaseProps>(
  (props, ref) => {
    const { as: Tag = 'label', children, ...other } = props;

    const defaultProps = useContext(LabelContext);
    const commonProps = mergeProps(defaultProps, other);

    return (
      <Tag {...commonProps} ref={ref}>
        {children}
      </Tag>
    );
  }
);

Label.displayName = 'Label';

export type LabelProps<As extends ElementType = 'label'> =
  ComponentPropsWithRef<typeof Label<As>>;
