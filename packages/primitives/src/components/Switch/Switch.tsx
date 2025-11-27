'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';

import { useDOMRef, mergeProps, filterDOMProps } from '@koobiq/react-core';
import { VisuallyHidden } from '@react-aria/visually-hidden';

import { useSwitch } from '../../behaviors';
import { removeDataAttributes, useRenderProps } from '../../utils';

import type { SwitchProps, SwitchRenderProps } from './index';

export const Switch = forwardRef<ComponentRef<'label'>, SwitchProps>(
  (props, ref) => {
    const { children, inputRef } = props;

    const domRef = useDOMRef<ComponentRef<'input'>>(inputRef);

    const {
      isHovered,
      isInvalid,
      isReadOnly,
      isSelected,
      isFocused,
      isPressed,
      labelProps,
      inputProps,
      isFocusVisible,
      isDisabled: isDisabledAria,
    } = useSwitch(
      {
        ...removeDataAttributes(props),
        children: typeof children === 'function' ? true : children,
      },
      domRef
    );

    const isDisabled = isDisabledAria || false;

    const renderValues: SwitchRenderProps = {
      isHovered,
      isInvalid,
      isFocused,
      isPressed,
      isDisabled,
      isSelected,
      isReadOnly,
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
        data-indeterminate={isDisabled || undefined}
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

Switch.displayName = 'Switch';
