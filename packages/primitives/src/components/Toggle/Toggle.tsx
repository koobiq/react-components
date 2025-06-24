'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';

import { useDOMRef, mergeProps, filterDOMProps } from '@koobiq/react-core';
import { VisuallyHidden } from '@react-aria/visually-hidden';

import { useToggle } from '../../behaviors';
import { removeDataAttributes, useRenderProps } from '../../utils';

import type { ToggleProps } from './index';

export const Toggle = forwardRef<ComponentRef<'label'>, ToggleProps>(
  (props, ref) => {
    const { children, inputRef } = props;

    const domRef = useDOMRef<ComponentRef<'input'>>(inputRef);

    const {
      isHovered,
      isInvalid,
      isSelected,
      isFocused,
      isPressed,
      isFocusVisible,
      labelProps,
      inputProps,
    } = useToggle(
      {
        ...removeDataAttributes(props),
        children: typeof children === 'function' ? true : children,
      },
      domRef
    );

    const renderValues = {
      isHovered,
      isInvalid,
      isSelected,
      isFocused,
      isPressed,
      isFocusVisible,
      isDisabled: props.isDisabled || false,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

    const DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    return (
      <label {...mergeProps(DOMProps, labelProps, renderProps)} ref={ref}>
        <VisuallyHidden elementType="span">
          <input {...inputProps} ref={domRef} />
        </VisuallyHidden>
        {renderProps.children}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
