'use client';

import { forwardRef } from 'react';

import { mergeProps } from '@koobiq/react-core';

import {
  type TextareaProps,
  type TextareaRef,
  useTextareaContext,
} from './index';

export const Textarea = forwardRef<TextareaRef, TextareaProps>((props, ref) => {
  const { children, ...other } = props;

  const defaultProps = useTextareaContext();
  const commonProps = mergeProps(defaultProps, other);

  return (
    <textarea {...commonProps} ref={ref}>
      {children}
    </textarea>
  );
});

Textarea.displayName = 'Textarea';
