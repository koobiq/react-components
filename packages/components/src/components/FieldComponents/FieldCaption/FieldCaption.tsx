import { forwardRef } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import { Text, type TextProps, type TextRef } from '@koobiq/react-primitives';

import s from './FieldCaption.module.css';

export type FieldCaptionProps = TextProps;
export type FieldCaptionRef = TextRef;

export const FieldCaption = forwardRef<FieldCaptionRef, FieldCaptionProps>(
  ({ children, className, ...other }, ref) =>
    isNotNil(children) ? (
      <Text
        className={clsx(s.base, className)}
        slot="description"
        {...other}
        ref={ref}
      >
        {children}
      </Text>
    ) : null
);

FieldCaption.displayName = 'FieldCaption';
