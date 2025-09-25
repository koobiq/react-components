import { forwardRef } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import { Text, type TextProps, type TextRef } from '@koobiq/react-primitives';

import s from './FormFieldCaption.module.css';

export type FormFieldCaptionProps = TextProps;

export type FormFieldCaptionRef = TextRef;

export const FormFieldCaption = forwardRef<
  FormFieldCaptionRef,
  FormFieldCaptionProps
>(({ children, className, ...other }, ref) =>
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

FormFieldCaption.displayName = 'FormFieldCaption';
