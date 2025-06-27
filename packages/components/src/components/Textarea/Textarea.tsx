'use client';

import { forwardRef } from 'react';

import { mergeProps } from '@koobiq/react-core';
import { TextField } from '@koobiq/react-primitives';

import { FieldControl } from '../FieldComponents';

import { TextareaContextConsumer } from './components';
import type { TextareaProps, TextareaRef } from './index';

export const Textarea = forwardRef<TextareaRef, TextareaProps>((props, ref) => {
  const {
    variant = 'filled',
    fullWidth = false,
    hiddenLabel = false,
    rows,
    cols,
    expand,
    errorMessage,
    slotProps,
    caption,
    label,
    ...other
  } = props;

  const rootProps = mergeProps(
    {
      label,
      fullWidth,
      errorMessage,
      'data-variant': variant,
      'data-fullwidth': fullWidth,
    },
    other
  );

  return (
    <FieldControl as={TextField} inputElementType="textarea" {...rootProps}>
      {(values) => (
        <TextareaContextConsumer
          {...values}
          rows={rows}
          cols={cols}
          label={label}
          expand={expand}
          variant={variant}
          caption={caption}
          slotProps={slotProps}
          hiddenLabel={hiddenLabel}
          errorMessage={errorMessage}
          ref={ref}
        />
      )}
    </FieldControl>
  );
});

Textarea.displayName = 'Textarea';
