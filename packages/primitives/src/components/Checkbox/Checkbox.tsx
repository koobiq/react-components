'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';

import { useDOMRef, mergeProps, filterDOMProps } from '@koobiq/react-core';
import { VisuallyHidden } from '@react-aria/visually-hidden';

import { useCheckbox } from '../../behaviors';
import { removeDataAttributes, useRenderProps } from '../../utils';

import type { CheckboxProps } from './index';

export const Checkbox = forwardRef<ComponentRef<'label'>, CheckboxProps>(
  (props, ref) => {
    const { children, inputRef } = props;

    const domRef = useDOMRef<ComponentRef<'input'>>(inputRef);

    const {
      isHovered,
      isInvalid,
      isSelected,
      isFocused,
      isPressed,
      isReadOnly,
      isDisabled,
      isFocusVisible,
      isIndeterminate,
      labelProps,
      inputProps,
    } = useCheckbox(
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
      isIndeterminate,
      isDisabled: props.isDisabled || false,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

    const DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    return (
      <label
        data-hovered={isHovered}
        data-pressed={isPressed}
        data-focused={isFocused}
        data-invalid={isInvalid}
        data-selected={isSelected}
        data-disabled={isDisabled}
        data-read-only={isReadOnly}
        data-focus-visible={isFocusVisible}
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

Checkbox.displayName = 'Checkbox';
