'use client';

import { forwardRef } from 'react';

import { mergeProps, useMultiRef } from '@koobiq/react-core';

import { type InputProps, type InputRef, useInputContext } from './index';

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const { children, ...other } = props;

  const defaultProps = useInputContext();
  const commonProps = mergeProps(defaultProps, other);

  const innerRef = useMultiRef([
    ref,
    ...(defaultProps.ref ? [defaultProps.ref] : []),
  ]);

  return (
    <input {...commonProps} ref={innerRef}>
      {children}
    </input>
  );
});

Input.displayName = 'Input';
