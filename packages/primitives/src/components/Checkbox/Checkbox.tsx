'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';

import { useDOMRef } from '@koobiq/react-core';
import { mergeProps, VisuallyHidden } from 'react-aria';

import { useCheckbox } from '../../behaviors';
import { useRenderProps } from '../../utils';

import type { CheckboxProps } from './index';

export const Checkbox = forwardRef<ComponentRef<'input'>, CheckboxProps>(
  (props, ref) => {
    const { children, labelProps: labelPropsProp } = props;

    const domRef = useDOMRef<ComponentRef<'input'>>(ref);

    const {
      hovered,
      error,
      checked,
      focusVisible,
      indeterminate,
      labelProps,
      inputProps,
    } = useCheckbox(
      {
        ...props,
        children: typeof children === 'function' ? true : children,
      },
      domRef
    );

    const renderValues = {
      hovered,
      error,
      checked,
      focusVisible,
      indeterminate,
      disabled: props.disabled || false,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

    return (
      <label {...mergeProps(labelProps, labelPropsProp, renderProps)}>
        <VisuallyHidden>
          <input {...inputProps} />
        </VisuallyHidden>
        {renderProps.children}
      </label>
    );
  }
);

Checkbox.displayName = 'CheckboxPrimitive';
