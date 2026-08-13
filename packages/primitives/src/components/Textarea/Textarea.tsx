'use client';

import { forwardRef } from 'react';

import { mergeProps, useMultiRef } from '@koobiq/react-core';

import {
  type TextareaProps,
  type TextareaRef,
  useTextareaContext,
} from './index';

export const Textarea = forwardRef<TextareaRef, TextareaProps>((props, ref) => {
  const { children, ...other } = props;

  const defaultProps = useTextareaContext();
  const commonProps = mergeProps(defaultProps, other);

  const innerRef = useMultiRef([
    ref,
    ...(defaultProps.ref ? [defaultProps.ref] : []),
  ]);

  return (
    <textarea {...commonProps} ref={innerRef}>
      {children}
    </textarea>
  );
});

Textarea.displayName = 'Textarea';
