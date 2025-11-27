'use client';

import { type ComponentRef, forwardRef, useContext } from 'react';

import { useDOMRef, mergeProps, filterDOMProps } from '@koobiq/react-core';
import { VisuallyHidden } from '@react-aria/visually-hidden';

import { useRadio } from '../../behaviors';
import { removeDataAttributes, useRenderProps } from '../../utils';

import type { RadioProps, RadioRenderProps } from './index';
import { RadioContext } from './index';

export const Radio = forwardRef<ComponentRef<'label'>, RadioProps>(
  (props, ref) => {
    const { children, inputRef } = props;

    const state = useContext(RadioContext);
    const { isInvalid } = state;

    const domRef = useDOMRef<ComponentRef<'input'>>(inputRef);

    const {
      isHovered,
      isFocused,
      isPressed,
      isDisabled,
      isSelected,
      labelProps,
      inputProps,
      isReadOnly,
      isFocusVisible,
    } = useRadio(
      {
        ...removeDataAttributes(props),
        children: typeof children === 'function' ? true : children,
      },
      state,
      domRef
    );

    const renderValues: RadioRenderProps = {
      isInvalid,
      isHovered,
      isSelected,
      isFocused,
      isPressed,
      isReadOnly,
      isDisabled,
      isFocusVisible,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

    const DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    return (
      <label
        data-hovered={isHovered || undefined}
        data-pressed={isPressed || undefined}
        data-focused={isFocused || undefined}
        data-invalid={isInvalid || undefined}
        data-selected={isSelected || undefined}
        data-disabled={isDisabled || undefined}
        data-read-only={isReadOnly || undefined}
        data-focus-visible={isFocusVisible || undefined}
        {...mergeProps(DOMProps, labelProps, renderProps)}
        ref={ref}
      >
        <VisuallyHidden elementType="span">
          <input {...inputProps} ref={domRef} />
        </VisuallyHidden>
        {renderProps.children}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
